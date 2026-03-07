import { createContext, useContext, useEffect, useState, useMemo } from "react";
import type { CV, CvDebugConfig, OpenCVContextValue } from "../types";
import signatures from "../data/opencv-signatures.json";

const OpenCvContext = createContext<OpenCVContextValue | null>(null);

export function useOpenCv(): OpenCVContextValue {
  const ctx = useContext(OpenCvContext);
  if (!ctx) {
    throw new Error("useOpenCV must be used within OpenCVProvider");
  }
  return ctx;
}

function detectMissingOps(cv: CV, warn: boolean): Set<string> {
  const missing = new Set<string>();
  for (const name of Object.keys(signatures)) {
    if (typeof cv[name] !== "function") {
      missing.add(name);
    }
  }
  if (warn && missing.size > 0) {
    console.warn(
      `OpenCV.js bundle is missing ${missing.size} operations from signatures:\n  ${[...missing].join(", ")}`
    );
  }
  return missing;
}

const scriptId = 'opencv-react'
const moduleConfig = {
  wasmBinaryFile: 'opencv_js.wasm',
  usingWasm: true,
  onRuntimeInitialized: () => { },
}

const emptyMissing = new Set<string>();
const defaultDebug: CvDebugConfig = {
  validateOps: true,
  warnMissingOps: true,
  logPipeline: false,
};

export const OpenCvProvider = ({
  openCvVersion = '4.9.0',
  openCvPath = '',
  debug,
  children,
}: {
  openCvVersion?: string,
  openCvPath?: string,
  debug?: CvDebugConfig,
  children: any,
}) => {
  const resolvedDebug = useMemo<CvDebugConfig>(() => ({
    ...defaultDebug,
    ...debug,
  }), [debug]);

  const [cvInstance, setCvInstance] = useState<OpenCVContextValue>({
    cv: null,
    loading: true,
    error: null,
    loaded: false,
    missingOps: emptyMissing,
    debug: resolvedDebug,
  });

  useEffect(() => {
    if (document.getElementById(scriptId) || window.cv) {
      return
    }

    const startTime = Date.now();

    moduleConfig.onRuntimeInitialized = () => {
      console.log(`OpenCV loaded in ${Date.now() - startTime}ms`);
      const missingOps = resolvedDebug.validateOps
        ? detectMissingOps(window.cv, resolvedDebug.warnMissingOps ?? true)
        : emptyMissing;
      setCvInstance({
        loading: false,
        loaded: true,
        error: null,
        cv: window.cv,
        missingOps,
        debug: resolvedDebug,
      });
    }
    window.Module = moduleConfig

    const element = document.createElement('script');
    element.id = scriptId;
    element.src = openCvPath || `https://docs.opencv.org/${openCvVersion}/opencv.js`;
    element.defer = true;
    element.async = true;

    console.log('OpenCV loading from ' + element.src);

    document.body.appendChild(element)
  }, [openCvPath, openCvVersion])

  return (
    <OpenCvContext.Provider value={cvInstance}>
      {children}
    </OpenCvContext.Provider>
  )
}
