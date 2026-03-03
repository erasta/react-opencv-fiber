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
  component: React.ComponentType<{ children: React.ReactNode; [key: string]: any }>;
  params: Record<string, ParamConfig>;
}

export interface PipelineItem {
  id: number;
  name: string;
  enabled: boolean;
  props: Record<string, number>;
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
