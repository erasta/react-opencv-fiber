import { useState } from "react";
import { CvCanvas } from "@react-opencv/fiber";
import type { Mat } from "@react-opencv/fiber";

const defaultSrc = "https://picsum.photos/seed/split-pipe/600/400";

export const SplitPipeline = () => {
  const [ksize, setKsize] = useState(5);
  const [threshold1, setThreshold1] = useState(50);
  const [threshold2, setThreshold2] = useState(150);
  const [blurredMat, setBlurredMat] = useState<Mat | null>(null);

  return (
    <div style={{ padding: 20, maxWidth: 800 }}>
      <h3 style={{ margin: "0 0 12px", color: "#c0b0d0" }}>Split Pipeline</h3>
      <p style={{ margin: "0 0 12px", color: "#908098", fontSize: 13 }}>
        A headless CvCanvas blurs the image. Its output feeds two visible
        canvases: one shows the blurred intermediate, the other applies Canny.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 160 }}>Blur ksize: {ksize}</span>
          <input
            type="range"
            min={1}
            max={31}
            step={2}
            value={ksize}
            onChange={(e) => setKsize(Number(e.target.value))}
          />
        </label>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 160 }}>Canny T1: {threshold1}</span>
          <input
            type="range"
            min={0}
            max={255}
            value={threshold1}
            onChange={(e) => setThreshold1(Number(e.target.value))}
          />
        </label>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 160 }}>Canny T2: {threshold2}</span>
          <input
            type="range"
            min={0}
            max={255}
            value={threshold2}
            onChange={(e) => setThreshold2(Number(e.target.value))}
          />
        </label>
      </div>

      {/* Headless pipeline: blur the image, share the result */}
      <CvCanvas headless onResult={setBlurredMat}>
        <cvGaussianBlur ksize={[ksize, ksize]} sigmaX={0}>
          <cvImage src={defaultSrc} />
        </cvGaussianBlur>
      </CvCanvas>

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        {/* Show the intermediate blurred result */}
        <div style={{ flex: 1 }}>
          <div style={{ color: "#908098", fontSize: 12, marginBottom: 4 }}>Blurred (intermediate)</div>
          <CvCanvas style={{ maxWidth: "100%" }}>
            <cvMat mat={blurredMat} />
          </CvCanvas>
        </div>

        {/* Apply Canny on the blurred result */}
        <div style={{ flex: 1 }}>
          <div style={{ color: "#908098", fontSize: 12, marginBottom: 4 }}>Canny (from blurred)</div>
          <CvCanvas style={{ maxWidth: "100%" }}>
            <cvCanny threshold1={threshold1} threshold2={threshold2}>
              <cvCvtColor code={11}>
                <cvMat mat={blurredMat} />
              </cvCvtColor>
            </cvCanny>
          </CvCanvas>
        </div>
      </div>
    </div>
  );
};
