declare global {
  interface Window {
    cv: any;
    Module: any;
  }
}

export type CV = any;
export type Mat = any;

export interface CvDebugConfig {
  validateOps?: boolean;
  warnMissingOps?: boolean;
  logPipeline?: boolean;
}

export interface OpenCVContextValue {
  cv: CV | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;
  missingOps: Set<string>;
  debug: CvDebugConfig;
}

export type OnMatCallback = (mat: Mat) => void;

export interface ParamConfig {
  min: number;
  max: number;
  step: number;
  default: number;
}

export interface SignatureParam {
  name: string;
  required: boolean;
  type?: string;
}

export interface SignatureOverload {
  name: string;
  params: SignatureParam[];
  returns: string;
}

export interface SignatureEntry {
  overloads: SignatureOverload[];
}
