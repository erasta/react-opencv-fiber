import signatures from "../data/opencv-signatures.json";
import type { SignatureEntry } from "../types";

const sigs = signatures as Record<string, SignatureEntry>;

export function resolveOpName(elementName: string): string {
  // cvImage / cv_image → special leaf type
  if (elementName === "cvImage" || elementName === "cv_image") {
    return "__image__";
  }

  let name: string;
  if (elementName.startsWith("cv_")) {
    name = elementName.slice(3);
  } else if (elementName.startsWith("cv")) {
    name = elementName.slice(2);
  } else {
    name = elementName;
  }

  // Try as-is
  if (sigs[name]) return name;

  // Try toggling first char case
  const toggled = name[0] === name[0].toLowerCase()
    ? name[0].toUpperCase() + name.slice(1)
    : name[0].toLowerCase() + name.slice(1);
  if (sigs[toggled]) return toggled;

  throw new Error(`Unknown OpenCV operation: ${elementName} (tried ${name}, ${toggled})`);
}
