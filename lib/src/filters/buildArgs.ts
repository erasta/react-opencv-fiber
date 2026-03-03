import signatures from "../data/opencv-signatures.json";
import { coerceArg } from "./coerce";
import type { CV, Mat, SignatureEntry } from "../types";

const sigs = signatures as Record<string, SignatureEntry>;

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
  const args: unknown[] = [src, dst];

  let foundSrc = false;
  let foundDst = false;

  for (const p of params) {
    if (!foundSrc && p.type === "InputArray") {
      foundSrc = true;
      continue;
    }
    if (!foundDst && p.type === "OutputArray") {
      foundDst = true;
      continue;
    }

    const value = props[p.name];
    if (value === undefined) {
      if (p.required) throw new Error(`Missing required param: ${p.name}`);
      break;
    }

    args.push(coerceArg(cv, value, p.type ?? ""));
  }

  return { args, dst, cleanupList };
}
