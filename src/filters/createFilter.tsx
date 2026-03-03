import { useRef, useCallback, useContext } from "react";
import { useOpenCV } from "../components/OpenCVProvider";
import { MatContext } from "../components/MatContext";
import type { Mat, ProcessFn } from "../types";

export function createFilter(name: string, processFn: ProcessFn) {
  return function FilterComponent({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: any;
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
        try {
          output = processFn(cv, inputMat, props);
        } catch (e) {
          console.warn(`Filter ${name} error:`, e);
          output = inputMat.clone();
        }
        prevOutRef.current = output;
        parentOnMat(output);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [cv, parentOnMat, ...Object.values(props)]
    );

    return <MatContext.Provider value={handleChildMat}>{children}</MatContext.Provider>;
  };
}
