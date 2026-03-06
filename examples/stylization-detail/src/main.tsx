import { StrictMode, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { OpenCvProvider, CvCanvas } from "@react-opencv/fiber";

const defaultSrc = "https://picsum.photos/seed/opencv-demo/600/400";

const pipeline = `<CvCanvas>
  <cvDetailEnhance sigma_s={10} sigma_r={0.15}>
    <cvStylization sigma_s={sigmaS} sigma_r={sigmaR}>
      <cvImage src={imageSrc} />
    </cvStylization>
  </cvDetailEnhance>
</CvCanvas>`;

const App = () => {
  const [sigmaS, setSigmaS] = useState(60);
  const [sigmaR, setSigmaR] = useState(0.45);
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
      <h3 style={{ margin: "0 0 12px", color: "#c0b0d0" }}>Stylization + Detail Enhance</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 160 }}>sigma_s: {sigmaS}</span>
          <input
            type="range"
            min={1}
            max={200}
            value={sigmaS}
            onChange={(e) => setSigmaS(Number(e.target.value))}
          />
        </label>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 160 }}>sigma_r: {sigmaR}</span>
          <input
            type="range"
            min={0.01}
            max={1.0}
            step={0.01}
            value={sigmaR}
            onChange={(e) => setSigmaR(Number(e.target.value))}
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
        <cvDetailEnhance sigma_s={10} sigma_r={0.15}>
          <cvStylization sigma_s={sigmaS} sigma_r={sigmaR}>
            <cvImage src={imageSrc} />
          </cvStylization>
        </cvDetailEnhance>
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
