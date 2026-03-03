import type { ReactNode } from "react";

export interface CvOpProps {
  children?: ReactNode;
  [param: string]: unknown;
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      [key: string]: CvOpProps;
    }
  }
}
