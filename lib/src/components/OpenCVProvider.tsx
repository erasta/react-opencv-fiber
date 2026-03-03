import { useState, useEffect, createContext, useContext } from "react";
import type { CV, OpenCVContextValue } from "../types";

const OpenCVContext = createContext<OpenCVContextValue | null>(null);

export function useOpenCV(): OpenCVContextValue {
  const ctx = useContext(OpenCVContext);
  if (!ctx) throw new Error("useOpenCV must be used within OpenCVProvider");
  return ctx;
}

export function OpenCVProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cv, setCv] = useState<CV | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.cv && window.cv.Mat) {
      setCv(window.cv);
      setLoading(false);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://docs.opencv.org/4.9.0/opencv.js";
    script.async = true;

    script.onload = () => {
      const check = setInterval(() => {
        if (window.cv && window.cv.Mat) {
          clearInterval(check);
          setCv(window.cv);
          setLoading(false);
        }
      }, 100);
      setTimeout(() => {
        clearInterval(check);
        if (!window.cv?.Mat) {
          setError("OpenCV timed out");
          setLoading(false);
        }
      }, 30000);
    };

    script.onerror = () => {
      setError("Failed to load OpenCV.js");
      setLoading(false);
    };

    document.head.appendChild(script);
  }, []);

  return (
    <OpenCVContext.Provider value={{ cv, loading, error }}>
      {children}
    </OpenCVContext.Provider>
  );
}
