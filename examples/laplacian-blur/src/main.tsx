import { StrictMode, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { OpenCvProvider, CvCanvas } from "@react-opencv/fiber";

const defaultSrc = "https://picsum.photos/seed/city-buildings/600/400";

const pipeline = `<CvCanvas>
  <cvConvertScaleAbs alpha={alpha}>
    <cvLaplacian ddepth={5} ksize={lapKsize}>
      <cvCvtColor code={11}>
        <cvGaussianBlur ksize={[k, k]} sigmaX={0}>
          <cvImage src={imageSrc} />
        </cvGaussianBlur>
      </cvCvtColor>
    </cvLaplacian>
  </cvConvertScaleAbs>
</CvCanvas>`;

const App = () => {
  const [blurKsize, setBlurKsize] = useState(5);
  const [lapKsize, setLapKsize] = useState(3);
  const [alpha, setAlpha] = useState(4);
  const [imageSrc, setImageSrc] = useState(defaultSrc);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageSrc(URL.createObjectURL(file));
  };

  return (
    <div style={{ padding: 20, maxWidth: 800 }}>
      <h3 style={{ margin: "0 0 12px", color: "#c0b0d0" }}>Laplacian + Gaussian Blur</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 160 }}>blur ksize: {blurKsize}</span>
          <input type="range" min={1} max={31} step={2} value={blurKsize}
            onChange={(e) => setBlurKsize(Number(e.target.value))} />
        </label>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 160 }}>laplacian ksize: {lapKsize}</span>
          <input type="range" min={1} max={7} step={2} value={lapKsize}
            onChange={(e) => setLapKsize(Number(e.target.value))} />
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
            <cvLaplacian ddepth={5} ksize={lapKsize}>
              <cvCvtColor code={11}>
                <cvGaussianBlur ksize={[blurKsize, blurKsize]} sigmaX={0}>
                  <cvImage src={imageSrc} />
                </cvGaussianBlur>
              </cvCvtColor>
            </cvLaplacian>
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
