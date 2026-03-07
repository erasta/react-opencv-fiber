import {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import type { ReactNode, CSSProperties } from "react";
import reconciler from "./reconciler";
import { CvNode } from "./CvNode";
import { executePipeline } from "./executePipeline";
import { descMat } from "./matDebug";
import { useOpenCv } from "../components/OpenCvProvider";
import type { Mat } from "../types";

export interface CvCanvasProps {
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
  onResult?: (mat: Mat) => void;
}

export const CvCanvas = forwardRef<HTMLCanvasElement, CvCanvasProps>(
  function CvCanvas({
    children,
    style,
    className,
    onResult,
  }: CvCanvasProps, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useImperativeHandle(ref, () => canvasRef.current!);

    const { cv, loaded } = useOpenCv();
    const containerRef = useRef<ReturnType<typeof reconciler.createContainer> | null>(null);
    const rootNodeRef = useRef<CvNode | null>(null);
    const rafRef = useRef<number>(0);
    const prevMatRef = useRef<Mat | null>(null);
    const onResultRef = useRef(onResult);
    onResultRef.current = onResult;

    // Create reconciler container once
    useEffect(() => {
      const runPipeline = async () => {
        if (!cv || !rootNodeRef.current) return;
        try {
          const mat = await executePipeline(cv, rootNodeRef.current);
          if (!mat) return;

          if (prevMatRef.current) {
            try { prevMatRef.current.delete(); } catch { /* noop */ }
          }
          prevMatRef.current = mat;

          console.log(`CvCanvas received: ${descMat(mat)}`);
          const canvas = canvasRef.current;
          if (canvas) {
            cv.imshow(canvas, mat);
          }
          onResultRef.current?.(mat);
        } catch (e) {
          console.warn("Pipeline execution error:", e);
        }
      };

      const scheduleRun = () => {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          void runPipeline();
        });
      };

      const rootNode = new CvNode("__root__", {});
      rootNode._rootNotify = scheduleRun;
      rootNodeRef.current = rootNode;

      const container = reconciler.createContainer(
        rootNode,
        0,    // ConcurrentRoot tag
        null, // hydrationCallbacks
        false, // isStrictMode
        null, // concurrentUpdatesByDefaultOverride
        "",   // identifierPrefix
        () => {}, // onUncaughtError
        () => {}, // onCaughtError
        () => {}, // onRecoverableError
        () => {}, // onDefaultTransitionIndicator
      );
      containerRef.current = container;

      return () => {
        cancelAnimationFrame(rafRef.current);
        reconciler.updateContainer(null, container);
        rootNode.dispose();
        if (prevMatRef.current) {
          try { prevMatRef.current.delete(); } catch { /* noop */ }
          prevMatRef.current = null;
        }
      };
    }, [cv]);

    // Update fiber tree when children change
    useEffect(() => {
      if (containerRef.current) {
        reconciler.updateContainer(children, containerRef.current, null);
      }
    }, [cv, children]);

    return loaded
      ? (
        <canvas
          ref={canvasRef}
          style={style}
          className={className}
        />
      )
      : null;
  },
);
