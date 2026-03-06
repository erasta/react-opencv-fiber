import { StrictMode, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { OpenCvProvider, CvCanvas } from "@react-opencv/fiber";

const defaultSrc = "https://picsum.photos/seed/opencv-demo/600/400";

const pipeline = `<CvCanvas>
  <cvEdgePreservingFilter flags={1} sigma_s={sigmaS} sigma_r={0.4}>
    <cvCvtColor code={11}>
      <cvCanny threshold1={t1} threshold2={t2}>
        <cvImage src={imageSrc} />
      </cvCanny>
    </cvCvtColor>
  </cvEdgePreservingFilter>
</CvCanvas>`;

const App = () => {
  const [threshold1, setThreshold1] = useState(50);
  const [threshold2, setThreshold2] = useState(150);
  const [sigmaS, setSigmaS] = useState(60);
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
      <h3 style={{ margin: "0 0 12px", color: "#c0b0d0" }}>Edge-Preserving Filter + Canny</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 160 }}>threshold1: {threshold1}</span>
          <input
            type="range"
            min={0}
            max={255}
            value={threshold1}
            onChange={(e) => setThreshold1(Number(e.target.value))}
          />
        </label>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 160 }}>threshold2: {threshold2}</span>
          <input
            type="range"
            min={0}
            max={255}
            value={threshold2}
            onChange={(e) => setThreshold2(Number(e.target.value))}
          />
        </label>
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
        <cvEdgePreservingFilter flags={1} sigma_s={sigmaS} sigma_r={0.4}>
          <cvCvtColor code={11}>
            <cvCanny threshold1={threshold1} threshold2={threshold2}>
              <cvImage src={imageSrc} />
            </cvCanny>
          </cvCvtColor>
        </cvEdgePreservingFilter>
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
