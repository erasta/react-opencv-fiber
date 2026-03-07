import { ComponentType } from "react";
import { CannyGaussian } from "./CannyGaussian";
import { AdaptiveThresholdBlur } from "./AdaptiveThresholdBlur";
import { EdgePreservingCanny } from "./EdgePreservingCanny";
import { LaplacianBlur } from "./LaplacianBlur";
import { MeanshiftScharr } from "./MeanshiftScharr";
import { MedianEqualize } from "./MedianEqualize";
import { StylizationDetail } from "./StylizationDetail";
import { ThresholdBilateral } from "./ThresholdBilateral";

export const examples: { name: string; slug: string; component: ComponentType }[] = [
  { name: "Canny + Gaussian", slug: "canny-gaussian", component: CannyGaussian },
  { name: "Adaptive Threshold + Blur", slug: "adaptive-threshold-blur", component: AdaptiveThresholdBlur },
  { name: "Edge-Preserving + Canny", slug: "edge-preserving-canny", component: EdgePreservingCanny },
  { name: "Laplacian + Blur", slug: "laplacian-blur", component: LaplacianBlur },
  { name: "MeanShift + Scharr", slug: "meanshift-scharr", component: MeanshiftScharr },
  { name: "Median + Equalize", slug: "median-equalize", component: MedianEqualize },
  { name: "Stylization", slug: "stylization", component: StylizationDetail },
  { name: "Threshold + Bilateral", slug: "threshold-bilateral", component: ThresholdBilateral },
];
