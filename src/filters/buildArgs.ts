import signatures from "../data/opencv-signatures.json";
import { coerceArg } from "./coerce";
import type { CV, Mat, SignatureEntry } from "../types";

const sigs = signatures as Record<string, SignatureEntry>;

const SRC_TYPES = new Set(["InputArray", "InputOutputArray"]);
const DST_TYPES = new Set(["OutputArray", "InputOutputArray"]);

export function buildArgs(
  cv: CV,
  op: string,
  src: Mat,
  props: Record<string, unknown>,
): { args: unknown[]; dst: Mat; cleanupList: Mat[] } {
  const entry = sigs[op];
  if (!entry) throw new Error(`Unknown op: ${op}`);

  const params = entry.overloads[0].params;
  const dst = new cv.Mat();
  const cleanupList: Mat[] = [dst];

  // Determine src and dst positions in the JS call.
  // OpenCV.js convention: src=0, dst=1, then remaining params.
  // Allow override via __srcParam / __dstParam (index or param name).
  const srcPos = resolvePosition(props.__srcParam, 0);
  const dstPos = resolvePosition(props.__dstParam, 1);

  // Collect non-src/dst params from the signature in order
  const otherArgs: unknown[] = [];
  for (const p of params) {
    if (SRC_TYPES.has(p.type ?? "") || DST_TYPES.has(p.type ?? "")) {
      continue;
    }

    const value = props[p.name];
    if (value === undefined) {
      if (p.required) throw new Error(`Missing required param: ${p.name}`);
      break;
    }

    otherArgs.push(coerceArg(cv, value, p.type ?? ""));
  }

  // Build the final args array with src/dst at their correct positions
  const totalLen = Math.max(srcPos, dstPos) + 1 + otherArgs.length;
  const args: unknown[] = new Array(totalLen);
  args[srcPos] = src;
  args[dstPos] = dst;

  // Fill remaining slots with otherArgs in order
  let oi = 0;
  for (let i = 0; i < totalLen && oi < otherArgs.length; i++) {
    if (i === srcPos || i === dstPos) continue;
    args[i] = otherArgs[oi++];
  }

  // Trim any trailing undefined
  while (args.length > 0 && args[args.length - 1] === undefined) {
    args.pop();
  }

  return { args, dst, cleanupList };
}

function resolvePosition(
  override: unknown,
  fallback: number,
): number {
  if (typeof override === "number") return override;
  return fallback;
}
