import type { CV } from "../types";

export function coerceArg(cv: CV, value: unknown, type: string): unknown {
  if (Array.isArray(value)) {
    switch (type) {
      case "Size":
        return new cv.Size(value[0], value[1]);
      case "Point":
      case "Point2f":
        return new cv.Point(value[0], value[1]);
      case "Scalar":
        return new cv.Scalar(...value);
    }
  }
  switch (type) {
    case "int":
      return Math.round(Number(value));
    case "double":
      return Number(value);
    default:
      return value;
  }
}
