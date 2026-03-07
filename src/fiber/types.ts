import type { ReactNode } from "react";
import type {} from "react/jsx-runtime";
import type {} from "react/jsx-dev-runtime";
import type signatures from "../data/opencv-signatures.json";

export interface CvOpProps {
  children?: ReactNode;
  [param: string]: unknown;
}

type SigKeys = keyof typeof signatures;

type CvElements = {
  [K in SigKeys as `cv${K}`]: CvOpProps;
} & {
  [K in SigKeys as `cv${Capitalize<K>}`]: CvOpProps;
} & {
  [K in SigKeys as `cv_${K}`]: CvOpProps;
} & {
  cvImage: CvOpProps;
  cv_image: CvOpProps;
  cvMat: CvOpProps;
  cv_mat: CvOpProps;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends CvElements {}
  }
}

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements extends CvElements {}
  }
}

declare module "react/jsx-dev-runtime" {
  namespace JSX {
    interface IntrinsicElements extends CvElements {}
  }
}
