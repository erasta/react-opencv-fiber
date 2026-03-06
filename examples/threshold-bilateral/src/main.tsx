import { StrictMode, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { OpenCvProvider, CvCanvas } from "@react-opencv/fiber";

const defaultSrc = "https://picsum.photos/seed/opencv-demo/600/400";

const pipeline = `<CvCanvas>
  <cvThreshold thresh={thresh} maxval={255} type={0}>
    <cvCvtColor code={11}>
      <cvBilateralFilter d={9} sigmaColor={sigmaColor} sigmaSpace={sigmaSpace}>
        <cvImage src={imageSrc} />
      </cvBilateralFilter>
    </cvCvtColor>
  </cvThreshold>
</CvCanvas>`;

const App = () => {
  const [thresh, setThresh] = useState(128);
  const [sigmaColor, setSigmaColor] = useState(75);
  const [sigmaSpace, setSigmaSpace] = useState(75);
  const [imageSrc, setImageSrc] = useState(defaultSrc);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800 }}>
      <h3 style={{ margin: "0 0 12px", color: "#c0b0d0" }}>Threshold + Bilateral Filter</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 160 }}>thresh: {thresh}</span>
          <input
            type="range"
            min={0}
            max={255}
            value={thresh}
            onChange={(e) => setThresh(Number(e.target.value))}
          />
        </label>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 160 }}>sigmaColor: {sigmaColor}</span>
          <input
            type="range"
            min={1}
            max={200}
            value={sigmaColor}
            onChange={(e) => setSigmaColor(Number(e.target.value))}
          />
        </label>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 160 }}>sigmaSpace: {sigmaSpace}</span>
          <input
            type="range"
            min={1}
            max={200}
            value={sigmaSpace}
            onChange={(e) => setSigmaSpace(Number(e.target.value))}
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
        <cvThreshold thresh={thresh} maxval={255} type={0}>
          <cvCvtColor code={11}>
            <cvBilateralFilter d={9} sigmaColor={sigmaColor} sigmaSpace={sigmaSpace}>
              <cvImage src={imageSrc} />
            </cvBilateralFilter>
          </cvCvtColor>
        </cvThreshold>
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
