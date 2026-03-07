import { useState } from "react";
import { OpenCvProvider } from "@react-opencv/fiber";
import { examples } from "./examples";

const App = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const ActiveExample = examples[activeIndex].component;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <nav
        style={{
          width: 250,
          padding: 16,
          borderRight: "1px solid #2a2040",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          overflowY: "auto",
        }}
      >
        {examples.map((ex, i) => (
          <a
            key={ex.name}
            onClick={() => setActiveIndex(i)}
            style={{
              display: "block",
              padding: "8px 12px",
              borderRadius: 6,
              color: i === activeIndex ? "#e0d8f0" : "#a098b8",
              background: i === activeIndex ? "#2a2040" : "transparent",
              textDecoration: "none",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {ex.name}
          </a>
        ))}
      </nav>
      <main style={{ flex: 1, overflowY: "auto" }}>
        <OpenCvProvider>
          <ActiveExample />
        </OpenCvProvider>
      </main>
    </div>
  );
};

export default App;
