import { useState } from "react";
import { OpenCvProvider, CvCanvas, useOpenCv } from "@react-opencv/fiber";

const App = () => {
  const [threshold1, setThreshold1] = useState(50);
  const [threshold2, setThreshold2] = useState(100);

  return (
    <>
      <h1>@react-opencv/fiber</h1>
      <div>
        <label>
          <span style={{ display: 'inline-block', width: 150 }}>
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
          <span style={{ display: 'inline-block', width: 150 }}>
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
      <CvCanvas style={{ maxWidth: "100%" }}>
        <cvCanny threshold1={threshold1} threshold2={threshold2}>
          <cvCvtColor code={11}>
            <cvGaussianBlur ksize={[5, 5]} sigmaX={0}>
              <cvImage src="https://picsum.photos/seed/opencv-demo/600/400" />
            </cvGaussianBlur>
          </cvCvtColor>
        </cvCanny>
      </CvCanvas>
    </>
  );
};

export default App;
