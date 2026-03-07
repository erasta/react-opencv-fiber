import { useState, useEffect } from "react";
import { OpenCvProvider } from "@react-opencv/fiber";
import { examples } from "./examples";

const getSlugFromHash = () => window.location.hash.replace(/^#\/?/, "");

const App = () => {
  const [soloSlug, setSoloSlug] = useState(getSlugFromHash);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const onHashChange = () => setSoloSlug(getSlugFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const soloIndex = examples.findIndex((ex) => ex.slug === soloSlug);
  const isSolo = soloIndex !== -1;
  const currentIndex = isSolo ? soloIndex : activeIndex;
  const CurrentExample = examples[currentIndex].component;

  return (
    <OpenCvProvider>
      <div style={{ display: "flex", height: "100vh" }}>
        {!isSolo && (
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
              <div
                key={ex.slug}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <a
                  onClick={() => setActiveIndex(i)}
                  style={{
                    flex: 1,
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
                <a
                  href={`#${ex.slug}`}
                  title="Open standalone"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 22,
                    height: 22,
                    borderRadius: 4,
                    fontSize: 11,
                    color: "#706090",
                    border: "1px solid #2a2040",
                    textDecoration: "none",
                    flexShrink: 0,
                  }}
                >
                  ↗
                </a>
              </div>
            ))}
          </nav>
        )}
        <main style={{ flex: 1, overflowY: "auto" }}>
          <CurrentExample />
        </main>
      </div>
    </OpenCvProvider>
  );
};

export default App;
