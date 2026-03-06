import type { CV, Mat } from "../types";

export class CvNode {
  type: string;
  props: Record<string, unknown>;
  parent: CvNode | null = null;
  children: CvNode[] = [];
  cachedMat: Mat | null = null;
  _rootNotify: (() => void) | null = null;

  constructor(
    type: string,
    props: Record<string, unknown>,
  ) {
    this.type = type;
    this.props = props;
  }

  appendChild(child: CvNode) {
    child.parent = this;
    child._rootNotify = this._rootNotify;
    this.children.push(child);
  }

  removeChild(child: CvNode) {
    child.parent = null;
    child._rootNotify = null;
    const idx = this.children.indexOf(child);
    if (idx !== -1) this.children.splice(idx, 1);
    child.dispose();
  }

  insertBefore(child: CvNode, before: CvNode) {
    child.parent = this;
    child._rootNotify = this._rootNotify;
    const idx = this.children.indexOf(before);
    if (idx !== -1) {
      this.children.splice(idx, 0, child);
    } else {
      this.children.push(child);
    }
  }

  propagateNotify(notify: (() => void) | null) {
    this._rootNotify = notify;
    for (const child of this.children) {
      child.propagateNotify(notify);
    }
  }

  dispose() {
    if (this.cachedMat) {
      try { this.cachedMat.delete(); } catch { /* noop */ }
      this.cachedMat = null;
    }
    for (const child of this.children) {
      child.dispose();
    }
    this.children = [];
  }

  async loadImage(cv: CV): Promise<Mat> {
    if (this.type !== "__image__") {
      throw new Error("loadImage called on non-image node");
    }
    const src = this.props.src as string;
    if (!src) throw new Error("cvImage requires a src prop");

    if (this.cachedMat) {
      try { this.cachedMat.delete(); } catch { /* noop */ }
      this.cachedMat = null;
    }

    return new Promise<Mat>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        const mat = cv.imread(canvas);
        this.cachedMat = mat;
        resolve(mat);
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }
}
