import type { CV, Mat } from "../types";
import { CvNode } from "./CvNode";
import { buildArgs } from "../filters/buildArgs";
import { descMat } from "./matDebug";

export async function executePipeline(
  cv: CV,
  node: CvNode,
): Promise<Mat | null> {
  if (node.type === "__root__") {
    // Root container: execute first child
    if (node.children.length === 0) return null;
    return executePipeline(cv, node.children[0]);
  }

  if (node.type === "__image__") {
    return node.loadImage(cv);
  }

  // Op node: execute child first (innermost), then apply this op
  if (node.children.length === 0) return null;
  const childMat = await executePipeline(cv, node.children[0]);
  if (!childMat) return null;

  let dst: Mat | null = null;
  try {
    const result = buildArgs(cv, node.type, childMat, node.props);
    dst = result.dst;
    console.log(`cv.${node.type}(`, ...result.args.map((a: unknown) => a instanceof cv.Mat ? descMat(a as Mat) : a), `)`);
    cv[node.type](...result.args);
    console.log(`  → ${descMat(dst!)}`);
    // Clean up child mat (intermediate)
    try { childMat.delete(); } catch { /* noop */ }
    return dst;
  } catch (e) {
    console.error(`cvOp ${node.type} error:`, e);
    if (dst) {
      try { dst.delete(); } catch { /* noop */ }
    }
    try { childMat.delete(); } catch { /* noop */ }
    return null;
  }
}
