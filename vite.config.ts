import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  root: "demo",
  plugins: [react()],
  resolve: {
    alias: {
      "react-opencv-fiber": path.resolve(
        __dirname,
        "lib/src/index.ts"
      ),
    },
  },
});
