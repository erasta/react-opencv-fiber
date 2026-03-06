import { StrictMode, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { OpenCvProvider, CvCanvas } from "@react-opencv/fiber";

const defaultSrc = "https://picsum.photos/seed/opencv-demo/600/400";

const pipeline = `<CvCanvas>
  <cvConvertScaleAbs>
    <cvScharr ddepth={-1} dx={1} dy={0}>
      <cvPyrMeanShiftFiltering sp={sp} sr={sr}>
        <cvImage src={imageSrc} />
      </cvPyrMeanShiftFiltering>
    </cvScharr>
  </cvConvertScaleAbs>
</CvCanvas>`;

const App = () => {
  const [sp, setSp] = useState(20);
  const [sr, setSr] = useState(40);
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
      <h3 style={{ margin: "0 0 12px", color: "#c0b0d0" }}>PyrMeanShift Filtering + Scharr</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 160 }}>sp: {sp}</span>
          <input
            type="range"
            min={1}
            max={80}
            value={sp}
            onChange={(e) => setSp(Number(e.target.value))}
          />
        </label>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 160 }}>sr: {sr}</span>
          <input
            type="range"
            min={1}
            max={80}
            value={sr}
            onChange={(e) => setSr(Number(e.target.value))}
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
        <cvConvertScaleAbs>
          <cvScharr ddepth={-1} dx={1} dy={0}>
            <cvPyrMeanShiftFiltering sp={sp} sr={sr}>
              <cvImage src={imageSrc} />
            </cvPyrMeanShiftFiltering>
          </cvScharr>
        </cvConvertScaleAbs>
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
