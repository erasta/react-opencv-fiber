import { StrictMode, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { OpenCvProvider, CvCanvas } from "@react-opencv/fiber";

const defaultSrc = "https://picsum.photos/seed/portrait-face/600/400";

const pipeline = `<CvCanvas>
  <cvMedianBlur ksize={ksize}>
    <cvEqualizeHist>
      <cvCvtColor code={11}>
        <cvImage src={imageSrc} />
      </cvCvtColor>
    </cvEqualizeHist>
  </cvMedianBlur>
</CvCanvas>`;

const App = () => {
  const [ksize, setKsize] = useState(5);
  const [imageSrc, setImageSrc] = useState(defaultSrc);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
    }
  };

  const handleKsizeChange = (value: number) => {
    // Ensure ksize is always odd
    const odd = value % 2 === 0 ? value + 1 : value;
    setKsize(Math.min(odd, 31));
  };

  return (
    <div style={{ padding: 20, maxWidth: 800 }}>
      <h3 style={{ margin: "0 0 12px", color: "#c0b0d0" }}>Median Blur + Equalize Histogram</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 160 }}>ksize: {ksize}</span>
          <input
            type="range"
            min={1}
            max={31}
            step={2}
            value={ksize}
            onChange={(e) => handleKsizeChange(Number(e.target.value))}
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
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <CvCanvas style={{ maxWidth: "100%", flex: 1 }}>
          <cvMedianBlur ksize={ksize}>
            <cvEqualizeHist>
              <cvCvtColor code={11}>
                <cvImage src={imageSrc} />
              </cvCvtColor>
            </cvEqualizeHist>
          </cvMedianBlur>
        </CvCanvas>
        <img src={imageSrc} style={{ width: "33%", borderRadius: 4, opacity: 0.85 }} />
      </div>
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
