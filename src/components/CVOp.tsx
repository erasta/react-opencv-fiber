import { useRef, useCallback, useContext } from "react";
import { useOpenCV } from "./OpenCVProvider";
import { MatContext } from "./MatContext";
import { buildArgs } from "../filters/buildArgs";
import type { Mat } from "../types";

export function CVOp({
  op,
  children,
  ...props
}: {
  op: string;
  children: React.ReactNode;
  [key: string]: unknown;
}) {
  const { cv } = useOpenCV();
  const parentOnMat = useContext(MatContext);
  const prevOutRef = useRef<Mat | null>(null);

  const handleChildMat = useCallback(
    (inputMat: Mat) => {
      if (!cv || !inputMat || !parentOnMat) return;

      if (prevOutRef.current) {
        try { prevOutRef.current.delete(); } catch (_) { /* noop */ }
      }

      let output: Mat;
      let dst: Mat | null = null;
      try {
        const result = buildArgs(cv, op, inputMat, props);
        dst = result.dst;
        cv[op](...result.args);
        output = dst;
      } catch (e) {
        console.warn(`CVOp ${op} error:`, e);
        if (dst) {
          try { dst.delete(); } catch (_) { /* noop */ }
        }
        output = inputMat.clone();
      }
      prevOutRef.current = output;
      parentOnMat(output);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cv, parentOnMat, op, ...Object.values(props)],
  );

  return <MatContext.Provider value={handleChildMat}>{children}</MatContext.Provider>;
}
