import { StrictMode, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { OpenCvProvider, CvCanvas } from "@react-opencv/fiber";

const defaultSrc = "https://picsum.photos/seed/opencv-demo/600/400";

const colormapNames: Record<number, string> = {
  0: "AUTUMN", 1: "BONE", 2: "JET", 3: "WINTER", 4: "RAINBOW",
  5: "OCEAN", 6: "SUMMER", 7: "SPRING", 8: "COOL", 9: "HSV",
  10: "PINK", 11: "HOT", 12: "PARULA", 13: "MAGMA", 14: "INFERNO",
  15: "PLASMA", 16: "VIRIDIS", 17: "CIVIDIS", 18: "TWILIGHT",
  19: "TWILIGHT_SHIFTED", 20: "TURBO", 21: "DEEPGREEN",
};

const pipeline = `<CvCanvas>
  <cvApplyColorMap colormap={colormap}>
    <cvConvertScaleAbs alpha={alpha}>
      <cvSobel ddepth={5} dx={1} dy={1} ksize={ksize}>
        <cvCvtColor code={11}>
          <cvImage src={imageSrc} />
        </cvCvtColor>
      </cvSobel>
    </cvConvertScaleAbs>
  </cvApplyColorMap>
</CvCanvas>`;

const App = () => {
  const [ksize, setKsize] = useState(3);
  const [alpha, setAlpha] = useState(4);
  const [colormap, setColormap] = useState(2);
  const [imageSrc, setImageSrc] = useState(defaultSrc);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageSrc(URL.createObjectURL(file));
  };

  return (
    <div style={{ padding: 20, maxWidth: 800 }}>
      <h3 style={{ margin: "0 0 12px", color: "#c0b0d0" }}>Sobel + ColorMap</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 220 }}>ksize: {ksize}</span>
          <input type="range" min={1} max={7} step={2} value={ksize}
            onChange={(e) => setKsize(Number(e.target.value))} />
        </label>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 220 }}>alpha: {alpha}</span>
          <input type="range" min={1} max={10} step={0.5} value={alpha}
            onChange={(e) => setAlpha(Number(e.target.value))} />
        </label>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 220 }}>colormap: {colormapNames[colormap]}</span>
          <input type="range" min={0} max={21} value={colormap}
            onChange={(e) => setColormap(Number(e.target.value))} />
        </label>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleUpload} />
        <button onClick={() => fileInputRef.current?.click()}>Upload</button>
        <a href="https://github.com/erasta/react-opencv-fiber" style={{ color: "#8070a0", fontSize: 12 }}>GitHub</a>
      </div>
      <CvCanvas style={{ maxWidth: "100%" }}>
        <cvApplyColorMap colormap={colormap}>
          <cvConvertScaleAbs alpha={alpha}>
            <cvSobel ddepth={5} dx={1} dy={1} ksize={ksize}>
              <cvCvtColor code={11}>
                <cvImage src={imageSrc} />
              </cvCvtColor>
            </cvSobel>
          </cvConvertScaleAbs>
        </cvApplyColorMap>
      </CvCanvas>
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
