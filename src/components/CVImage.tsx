import { useEffect, useRef, useContext } from "react";
import { useOpenCV } from "./OpenCVProvider";
import { MatContext } from "./MatContext";
import type { Mat } from "../types";

export function CVImage({
  src,
}: {
  src: string;
}) {
  const { cv } = useOpenCV();
  const onMat = useContext(MatContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevMatRef = useRef<Mat | null>(null);

  useEffect(() => {
    if (!cv || !src || !onMat) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx!.drawImage(img, 0, 0);

      if (prevMatRef.current) {
        try { prevMatRef.current.delete(); } catch (_) { /* noop */ }
      }
      const mat = cv.imread(canvas);
      prevMatRef.current = mat;
      onMat(mat);
    };
    img.src = src;

    return () => {
      if (prevMatRef.current) {
        try { prevMatRef.current.delete(); } catch (_) { /* noop */ }
        prevMatRef.current = null;
      }
    };
  }, [cv, src, onMat]);

  return <canvas ref={canvasRef} style={{ display: "none" }} />;
}
