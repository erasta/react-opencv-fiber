import { StrictMode, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { OpenCvProvider, CvCanvas } from "@react-opencv/fiber";

const defaultSrc = "https://picsum.photos/seed/colorful-fruit/600/400";

const pipeline = `<CvCanvas>
  <cvConvertScaleAbs alpha={alpha}>
    <cvScharr ddepth={5} dx={1} dy={0}>
      <cvCvtColor code={6}>
        <cvPyrMeanShiftFiltering sp={sp} sr={sr}>
          <cvCvtColor code={3}>
            <cvImage src={imageSrc} />
          </cvCvtColor>
        </cvPyrMeanShiftFiltering>
      </cvCvtColor>
    </cvScharr>
  </cvConvertScaleAbs>
</CvCanvas>`;

const App = () => {
  const [sp, setSp] = useState(20);
  const [sr, setSr] = useState(40);
  const [alpha, setAlpha] = useState(4);
  const [imageSrc, setImageSrc] = useState(defaultSrc);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageSrc(URL.createObjectURL(file));
  };

  return (
    <div style={{ padding: 20, maxWidth: 800 }}>
      <h3 style={{ margin: "0 0 12px", color: "#c0b0d0" }}>PyrMeanShift + Scharr</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 160 }}>sp: {sp}</span>
          <input type="range" min={1} max={80} value={sp}
            onChange={(e) => setSp(Number(e.target.value))} />
        </label>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 160 }}>sr: {sr}</span>
          <input type="range" min={1} max={80} value={sr}
            onChange={(e) => setSr(Number(e.target.value))} />
        </label>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 160 }}>alpha: {alpha}</span>
          <input type="range" min={1} max={10} step={0.5} value={alpha}
            onChange={(e) => setAlpha(Number(e.target.value))} />
        </label>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleUpload} />
        <button onClick={() => fileInputRef.current?.click()}>Upload</button>
        <a href="https://github.com/erasta/react-opencv-fiber" style={{ color: "#8070a0", fontSize: 12 }}>GitHub</a>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <CvCanvas style={{ maxWidth: "100%", flex: 1 }}>
          <cvConvertScaleAbs alpha={alpha}>
            <cvScharr ddepth={5} dx={1} dy={0}>
              <cvCvtColor code={6}>
                <cvPyrMeanShiftFiltering sp={sp} sr={sr}>
                  <cvCvtColor code={3}>
                    <cvImage src={imageSrc} />
                  </cvCvtColor>
                </cvPyrMeanShiftFiltering>
              </cvCvtColor>
            </cvScharr>
          </cvConvertScaleAbs>
        </CvCanvas>
        <img src={imageSrc} style={{ width: "33%", borderRadius: 4, opacity: 0.85 }} />
      </div>
      <pre style={{ marginTop: 16, color: "#9080b0", fontSize: 13 }}><code>{pipeline}</code></pre>
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
