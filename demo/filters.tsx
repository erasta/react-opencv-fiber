import { useRef, useEffect } from "react";
import { CVOp } from "../src/components/CVOp";
import { createFilter } from "../src/filters/createFilter";
import { useOpenCV } from "../src/components/OpenCVProvider";
import signatures from "../src/data/opencv-signatures.json";
import type { FilterDef, Mat, SignatureEntry } from "../src/types";

const sigs = signatures as Record<string, SignatureEntry>;

/* ── Dilate / Erode need a kernel Mat, so they wrap CVOp ──────── */

function useMorphKernel(ksize: number) {
  const { cv } = useOpenCV();
  const kernelRef = useRef<Mat | null>(null);

  if (kernelRef.current) {
    try { kernelRef.current.delete(); } catch (_) { /* noop */ }
  }
  if (cv) {
    kernelRef.current = cv.getStructuringElement(
      cv.MORPH_RECT,
      new cv.Size(ksize, ksize),
    );
  } else {
    kernelRef.current = null;
  }

  useEffect(() => {
    return () => {
      if (kernelRef.current) {
        try { kernelRef.current.delete(); } catch (_) { /* noop */ }
      }
    };
  }, []);

  return kernelRef.current;
}

function Dilate({
  children,
  ksize = 3,
  iterations = 1,
}: {
  children: React.ReactNode;
  ksize?: number;
  iterations?: number;
}) {
  const kernel = useMorphKernel(ksize);
  if (!kernel) return <>{children}</>;
  return (
    <CVOp op="dilate" kernel={kernel} anchor={[-1, -1]} iterations={iterations}>
      {children}
    </CVOp>
  );
}

function Erode({
  children,
  ksize = 3,
  iterations = 1,
}: {
  children: React.ReactNode;
  ksize?: number;
  iterations?: number;
}) {
  const kernel = useMorphKernel(ksize);
  if (!kernel) return <>{children}</>;
  return (
    <CVOp op="erode" kernel={kernel} anchor={[-1, -1]} iterations={iterations}>
      {children}
    </CVOp>
  );
}

/* ── Complex multi-step filters use createFilter ──────────────── */

const Grayscale = createFilter("Grayscale", (cv, mat) => {
  const gray = new cv.Mat();
  const out = new cv.Mat();
  if (mat.channels() === 4) {
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
  } else if (mat.channels() === 3) {
    cv.cvtColor(mat, gray, cv.COLOR_RGB2GRAY);
  } else {
    gray.delete();
    return mat.clone();
  }
  cv.cvtColor(gray, out, cv.COLOR_GRAY2RGBA);
  gray.delete();
  return out;
});

const Canny = createFilter("Canny", (cv, mat, { threshold1 = 50, threshold2 = 150 }) => {
  const gray = new cv.Mat();
  const edges = new cv.Mat();
  const out = new cv.Mat();
  if (mat.channels() >= 3) {
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
  } else {
    mat.copyTo(gray);
  }
  cv.Canny(gray, edges, threshold1, threshold2);
  cv.cvtColor(edges, out, cv.COLOR_GRAY2RGBA);
  gray.delete();
  edges.delete();
  return out;
});

const Threshold = createFilter("Threshold", (cv, mat, { value = 127, maxval = 255, type = "binary" }) => {
  const gray = new cv.Mat();
  const thresh = new cv.Mat();
  const out = new cv.Mat();
  if (mat.channels() >= 3) {
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
  } else {
    mat.copyTo(gray);
  }
  const types: Record<string, number> = {
    binary: cv.THRESH_BINARY,
    otsu: cv.THRESH_BINARY + cv.THRESH_OTSU,
    inv: cv.THRESH_BINARY_INV,
  };
  cv.threshold(gray, thresh, value, maxval, types[type] || cv.THRESH_BINARY);
  cv.cvtColor(thresh, out, cv.COLOR_GRAY2RGBA);
  gray.delete();
  thresh.delete();
  return out;
});

const Sobel = createFilter("Sobel", (cv, mat, { dx = 1, dy = 0, ksize = 3 }) => {
  const gray = new cv.Mat();
  const sob = new cv.Mat();
  const abs = new cv.Mat();
  const out = new cv.Mat();
  if (mat.channels() >= 3) cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
  else mat.copyTo(gray);
  cv.Sobel(gray, sob, cv.CV_16S, dx, dy, ksize);
  cv.convertScaleAbs(sob, abs);
  cv.cvtColor(abs, out, cv.COLOR_GRAY2RGBA);
  gray.delete(); sob.delete(); abs.delete();
  return out;
});

/* ── Generic CVOp wrapper ──────────────────────────────────────── */

function GenericCVOp({
  children,
  op,
  ...rest
}: {
  children: React.ReactNode;
  op?: string;
  [key: string]: unknown;
}) {
  if (!op) return <>{children}</>;
  return (
    <CVOp op={op} {...rest}>
      {children}
    </CVOp>
  );
}

export interface OpParamInfo {
  name: string;
  type: string;
  required: boolean;
  isNumeric: boolean;
}

const NUMERIC_TYPES = new Set(["int", "double", "float", "size_t", "short", "uchar"]);

export function getOpParams(opName: string): OpParamInfo[] {
  const entry = sigs[opName];
  if (!entry) return [];
  const params = entry.overloads[0]?.params ?? [];
  return params
    .filter((p) => p.type !== "InputArray" && p.type !== "OutputArray")
    .map((p) => ({
      name: p.name,
      type: p.type ?? "unknown",
      required: p.required,
      isNumeric: NUMERIC_TYPES.has(p.type ?? ""),
    }));
}

export const OP_NAMES = Object.keys(sigs).sort();

/* ── Filter registry ──────────────────────────────────────────── */

export const FILTERS: Record<string, FilterDef> = {
  Grayscale: { component: Grayscale, params: {} },
  GaussianBlur: {
    op: "GaussianBlur",
    mapProps: ({ ksize: rawKsize = 5 }) => {
      const ksize = rawKsize as number;
      const k = Math.max(1, ksize % 2 === 0 ? ksize + 1 : ksize);
      return { ksize: [k, k], sigmaX: 0 };
    },
    params: { ksize: { min: 1, max: 31, step: 2, default: 5 } },
  },
  Canny: { component: Canny, params: { threshold1: { min: 0, max: 255, step: 1, default: 50 }, threshold2: { min: 0, max: 255, step: 1, default: 150 } } },
  Threshold: { component: Threshold, params: { value: { min: 0, max: 255, step: 1, default: 127 } } },
  Dilate: { component: Dilate, params: { ksize: { min: 1, max: 15, step: 2, default: 3 }, iterations: { min: 1, max: 10, step: 1, default: 1 } } },
  Erode: { component: Erode, params: { ksize: { min: 1, max: 15, step: 2, default: 3 }, iterations: { min: 1, max: 10, step: 1, default: 1 } } },
  Invert: { op: "bitwise_not", params: {} },
  Sobel: { component: Sobel, params: { dx: { min: 0, max: 2, step: 1, default: 1 }, dy: { min: 0, max: 2, step: 1, default: 0 } } },
  CVOp: { component: GenericCVOp, params: {} },
};
