declare global {
  interface Window {
    cv: any;
  }
}

export type CV = any;
export type Mat = any;

export interface OpenCVContextValue {
  cv: CV | null;
  loading: boolean;
  error: string | null;
}

export type OnMatCallback = (mat: Mat) => void;

export type ProcessFn = (cv: CV, mat: Mat, props: Record<string, any>) => Mat;

export interface ParamConfig {
  min: number;
  max: number;
  step: number;
  default: number;
}

export interface FilterDef {
  params: Record<string, ParamConfig>;
  /** Direct OpenCV op name — PipelineOutput renders <CVOp op={...}> */
  op?: string;
  /** Transform user-facing slider props into CVOp props */
  mapProps?: (props: Record<string, number | string>) => Record<string, unknown>;
  /** Wrapper component for complex multi-step filters */
  component?: React.ComponentType<{ children: React.ReactNode; [key: string]: any }>;
}

export interface PipelineItem {
  id: number;
  name: string;
  enabled: boolean;
  props: Record<string, number | string>;
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
