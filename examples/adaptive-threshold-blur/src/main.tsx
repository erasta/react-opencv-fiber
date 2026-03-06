import { StrictMode, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { OpenCvProvider, CvCanvas } from "@react-opencv/fiber";

const defaultSrc = "https://picsum.photos/seed/opencv-demo/600/400";

const pipeline = `<CvCanvas>
  <cvAdaptiveThreshold maxValue={255} adaptiveMethod={1} thresholdType={0} blockSize={blockSize} C={c}>
    <cvCvtColor code={11}>
      <cvStackBlur ksize={[k, k]}>
        <cvImage src={imageSrc} />
      </cvStackBlur>
    </cvCvtColor>
  </cvAdaptiveThreshold>
</CvCanvas>`;

const App = () => {
  const [blockSize, setBlockSize] = useState(11);
  const [c, setC] = useState(2);
  const [blurKsize, setBlurKsize] = useState(5);
  const [imageSrc, setImageSrc] = useState(defaultSrc);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
    }
  };

  const ensureOdd = (v: number) => (v % 2 === 0 ? v + 1 : v);

  return (
    <div style={{ padding: 20, maxWidth: 800 }}>
      <h3 style={{ margin: "0 0 12px", color: "#c0b0d0" }}>Adaptive Threshold + Stack Blur</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 160 }}>Block Size: {blockSize}</span>
          <input
            type="range"
            min={3}
            max={99}
            step={2}
            value={blockSize}
            onChange={(e) => setBlockSize(ensureOdd(Number(e.target.value)))}
          />
        </label>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 160 }}>C: {c}</span>
          <input
            type="range"
            min={-10}
            max={30}
            value={c}
            onChange={(e) => setC(Number(e.target.value))}
          />
        </label>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 160 }}>Blur ksize: {blurKsize}</span>
          <input
            type="range"
            min={1}
            max={31}
            step={2}
            value={blurKsize}
            onChange={(e) => setBlurKsize(ensureOdd(Number(e.target.value)))}
          />
        </label>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleUpload}
        />
        <button onClick={() => fileInputRef.current?.click()}>Upload</button>
        <a href="https://github.com/erasta/react-opencv-fiber" style={{ color: "#8070a0", fontSize: 12 }}>
          GitHub
        </a>
      </div>
      <CvCanvas style={{ maxWidth: "100%" }}>
        <cvAdaptiveThreshold maxValue={255} adaptiveMethod={1} thresholdType={0} blockSize={blockSize} C={c}>
          <cvCvtColor code={11}>
            <cvStackBlur ksize={[blurKsize, blurKsize]}>
              <cvImage src={imageSrc} />
            </cvStackBlur>
          </cvCvtColor>
        </cvAdaptiveThreshold>
      </CvCanvas>
      <pre style={{ marginTop: 16, color: "#9080b0", fontSize: 13 }}>
        <code>{pipeline}</code>
      </pre>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OpenCvProvider>
      <App />
    </OpenCvProvider>
  </StrictMode>
);
