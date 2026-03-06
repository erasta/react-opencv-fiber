import { StrictMode, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { OpenCvProvider, CvCanvas } from "@react-opencv/fiber";

const defaultSrc = "https://picsum.photos/seed/opencv-demo/600/400";

const App = () => {
  const [threshold1, setThreshold1] = useState(50);
  const [threshold2, setThreshold2] = useState(100);
  const [imageSrc, setImageSrc] = useState(defaultSrc);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <h1>
        <a href="https://github.com/erasta/react-opencv-fiber">
          @react-opencv/fiber
        </a>
      </h1>
      <div>
        <label>
          <span style={{ display: "inline-block", width: 150 }}>
            Threshold 1: {threshold1}
          </span>
          <input
            type="range"
            min={0}
            max={255}
            value={threshold1}
            onChange={(e) => setThreshold1(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          <span style={{ display: "inline-block", width: 150 }}>
            Threshold 2: {threshold2}
          </span>
          <input
            type="range"
            min={0}
            max={255}
            value={threshold2}
            onChange={(e) => setThreshold2(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleUpload}
        />
        <button onClick={() => fileInputRef.current?.click()}>
          Upload Image
        </button>
      </div>
      <CvCanvas style={{ maxWidth: "100%" }}>
        <cvCanny threshold1={threshold1} threshold2={threshold2}>
          <cvCvtColor code={11}>
            <cvGaussianBlur ksize={[5, 5]} sigmaX={0}>
              <cvImage src={imageSrc} />
            </cvGaussianBlur>
          </cvCvtColor>
        </cvCanny>
      </CvCanvas>
    </>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OpenCvProvider>
      <App />
    </OpenCvProvider>
  </StrictMode>
);
