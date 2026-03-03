import { useRef, useCallback, useMemo } from "react";
import { useOpenCV } from "./OpenCVProvider";
import { MatContext } from "./MatContext";
import { CVImage } from "./CVImage";
import { CVOp } from "./CVOp";
import type { Mat, FilterDef, PipelineItem } from "../types";

export function PipelineOutput({
  imageSrc,
  pipeline,
  filters,
  onResult,
}: {
  imageSrc: string;
  pipeline: PipelineItem[];
  filters: Record<string, FilterDef>;
  onResult?: (dataUrl: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { cv } = useOpenCV();

  const handleFinalMat = useCallback(
    (mat: Mat) => {
      if (!cv || !mat || !canvasRef.current) return;
      try {
        cv.imshow(canvasRef.current, mat);
        if (onResult) onResult(canvasRef.current.toDataURL());
      } catch (e) {
        console.warn("imshow error:", e);
      }
    },
    [cv, onResult]
  );

  const tree = useMemo(() => {
    let node: React.ReactNode = <CVImage src={imageSrc} />;
    for (let i = pipeline.length - 1; i >= 0; i--) {
      const f = pipeline[i];
      if (!f.enabled) continue;
      const def = filters[f.name];
      if (!def) continue;
      if (def.op) {
        const mapped = def.mapProps ? def.mapProps(f.props) : f.props;
        node = <CVOp op={def.op} {...mapped}>{node}</CVOp>;
      } else if (def.component) {
        const Comp = def.component;
        node = <Comp {...f.props}>{node}</Comp>;
      }
    }
    return node;
  }, [imageSrc, pipeline, filters]);

  return (
    <div>
      <MatContext.Provider value={handleFinalMat}>{tree}</MatContext.Provider>
      <canvas ref={canvasRef} style={{ maxWidth: "100%", borderRadius: 8 }} />
    </div>
  );
}
