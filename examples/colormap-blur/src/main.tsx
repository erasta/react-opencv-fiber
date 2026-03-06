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
    <cvCvtColor code={11}>
      <cvGaussianBlur ksize={[k, k]} sigmaX={0}>
        <cvImage src={imageSrc} />
      </cvGaussianBlur>
    </cvCvtColor>
  </cvApplyColorMap>
</CvCanvas>`;

const App = () => {
  const [colormap, setColormap] = useState(2);
  const [blurKsize, setBlurKsize] = useState(1);
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
      <h3 style={{ margin: "0 0 12px", color: "#c0b0d0" }}>Colormap + Gaussian Blur</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 220 }}>
            colormap: {colormapNames[colormap]}
          </span>
          <input
            type="range"
            min={0}
            max={21}
            value={colormap}
            onChange={(e) => setColormap(Number(e.target.value))}
          />
        </label>
        <label style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 220 }}>blur ksize: {blurKsize}</span>
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
        <cvApplyColorMap colormap={colormap}>
          <cvCvtColor code={11}>
            <cvGaussianBlur ksize={[blurKsize, blurKsize]} sigmaX={0}>
              <cvImage src={imageSrc} />
            </cvGaussianBlur>
          </cvCvtColor>
        </cvApplyColorMap>
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
