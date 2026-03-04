import { useState, useEffect, createContext, useContext } from "react";
import type { OpenCVContextValue } from "../types";

const OpenCvContext = createContext<OpenCVContextValue | null>(null);

export function useOpenCv(): OpenCVContextValue {
  const ctx = useContext(OpenCvContext);
  if (!ctx) {
    throw new Error("useOpenCV must be used within OpenCVProvider");
  }
  return ctx;
}

const scriptId = 'opencv-react'
const moduleConfig = {
  wasmBinaryFile: 'opencv_js.wasm',
  usingWasm: true,
  onRuntimeInitialized: () => { },
}

export const OpenCvProvider = ({
  openCvVersion = '4.9.0',
  openCvPath = '',
  verbose = true,
  children,
}: {
  openCvVersion?: string,
  openCvPath?: string,
  verbose?: boolean,
  children: any,
}) => {
  const [cvInstance, setCvInstance] = useState<OpenCVContextValue>({
    cv: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (document.getElementById(scriptId) || window.cv) {
      return
    }

    const startTime = verbose ? Date.now() : 0;

    // https://docs.opencv.org/3.4/dc/de6/tutorial_js_nodejs.html
    // https://medium.com/code-divoire/integrating-opencv-js-with-an-angular-application-20ae11c7e217
    // https://stackoverflow.com/questions/56671436/cv-mat-is-not-a-constructor-opencv
    moduleConfig.onRuntimeInitialized = () => {
      setCvInstance({ loading: true, error: null, cv: window.cv });
      if (verbose) console.log(`OpenCV loaded in ${Date.now() - startTime}ms`);
    }
    window.Module = moduleConfig

    const generateOpenCvScriptTag = () => {
      const js = document.createElement('script');
      js.id = scriptId;
      js.src = openCvPath || `https://docs.opencv.org/${openCvVersion}/opencv.js`;
      // js.nonce = true;
      js.defer = true;
      js.async = true;
      if (verbose) console.log('OpenCV loading from ' + js.src);
      return js
    }

    document.body.appendChild(generateOpenCvScriptTag())
  }, [openCvPath, openCvVersion])

  return (
    <OpenCvContext.Provider value={cvInstance}>
      {children}
    </OpenCvContext.Provider>
  )
}
