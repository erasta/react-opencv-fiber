import type { Mat } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const descMat = (m: Mat) => `Mat#${(m as any).$$?.ptr ?? '?'}(${m.rows}x${m.cols}, ch=${m.channels()}, type=${m.type()})`;
