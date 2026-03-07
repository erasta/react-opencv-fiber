import { ComponentType } from "react";
import { CannyGaussian } from "./CannyGaussian";
import { AdaptiveThresholdBlur } from "./AdaptiveThresholdBlur";
import { EdgePreservingCanny } from "./EdgePreservingCanny";
import { LaplacianBlur } from "./LaplacianBlur";
import { MeanshiftScharr } from "./MeanshiftScharr";
import { MedianEqualize } from "./MedianEqualize";
import { StylizationDetail } from "./StylizationDetail";
import { ThresholdBilateral } from "./ThresholdBilateral";

export const examples: { name: string; component: ComponentType }[] = [
  { name: "Canny + Gaussian", component: CannyGaussian },
  { name: "Adaptive Threshold + Blur", component: AdaptiveThresholdBlur },
  { name: "Edge-Preserving + Canny", component: EdgePreservingCanny },
  { name: "Laplacian + Blur", component: LaplacianBlur },
  { name: "MeanShift + Scharr", component: MeanshiftScharr },
  { name: "Median + Equalize", component: MedianEqualize },
  { name: "Stylization", component: StylizationDetail },
  { name: "Threshold + Bilateral", component: ThresholdBilateral },
];
