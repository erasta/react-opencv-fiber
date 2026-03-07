import type { CV, Mat, CvDebugConfig } from "../types";
import { CvNode } from "./CvNode";
import { buildArgs } from "../filters/buildArgs";
import { descMat } from "./matDebug";

const warnedOps = new Set<string>();

export async function executePipeline(
  cv: CV,
  node: CvNode,
  missingOps?: Set<string>,
  debug?: CvDebugConfig,
): Promise<Mat | null> {
  if (node.type === "__root__") {
    if (node.children.length === 0) return null;
    return executePipeline(cv, node.children[0], missingOps, debug);
  }

  if (node.type === "__image__") {
    return node.loadImage(cv);
  }

  // Op node: execute child first (innermost), then apply this op
  if (node.children.length === 0) return null;
  const childMat = await executePipeline(cv, node.children[0], missingOps, debug);
  if (!childMat) return null;

  // Check if op is missing from the OpenCV.js bundle
  if (missingOps?.has(node.type)) {
    if (!warnedOps.has(node.type)) {
      warnedOps.add(node.type);
      console.error(
        `cv.${node.type} is not available in this OpenCV.js bundle. ` +
        `You may need a custom build that includes it.`
      );
    }
    try { childMat.delete(); } catch { /* noop */ }
    return null;
  }

  let dst: Mat | null = null;
  try {
    const result = buildArgs(cv, node.type, childMat, node.props);
    dst = result.dst;
    if (debug?.logPipeline) {
      console.log(`cv.${node.type}(`, ...result.args.map((a: unknown) => a instanceof cv.Mat ? descMat(a as Mat) : a), `)`);
    }
    cv[node.type](...result.args);
    if (debug?.logPipeline) {
      console.log(`  → ${descMat(dst!)}`);
    }
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
