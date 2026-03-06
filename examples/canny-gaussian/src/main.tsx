import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { OpenCvProvider } from "@react-opencv/fiber";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OpenCvProvider>
      <App />
    </OpenCvProvider>
  </StrictMode>
);
