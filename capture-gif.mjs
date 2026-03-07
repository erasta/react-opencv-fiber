#!/usr/bin/env node
import { execSync } from "child_process";
import { mkdirSync, rmSync } from "fs";
import { createConnection } from "net";

// --- Config ---

const slug = process.argv[2] || "canny-gaussian";
const port = Number(process.argv[3]) || 5199;
const outDir = process.argv[4] || "gifs";
const baseUrl = `http://localhost:${port}`;

// --- Preflight checks ---

// Check for convert (ImageMagick)
try {
  execSync("which convert", { stdio: "ignore" });
} catch {
  console.error("Error: 'convert' (ImageMagick) not found. Install it with: sudo apt install imagemagick");
  process.exit(1);
}

// Check dev server is running on port
await new Promise((resolve, reject) => {
  const sock = createConnection({ port }, () => {
    sock.destroy();
    resolve();
  });
  sock.on("error", () => {
    reject();
  });
}).catch(() => {
  console.error(`Error: Nothing is listening on port ${port}. Start the dev server first:\n  cd examples && npx vite --port ${port}`);
  process.exit(1);
});

// Check for Playwright Firefox
let firefox;
try {
  ({ firefox } = await import("playwright"));
} catch {
  console.error("Error: 'playwright' package not found. Install it with: npm install -D playwright");
  process.exit(1);
}

try {
  const testBrowser = await firefox.launch({ headless: true });
  await testBrowser.close();
} catch {
  console.error("Error: Playwright Firefox browser not installed. Run: npx playwright install firefox");
  process.exit(1);
}
import { tmpdir } from "os";
import { join } from "path";
const framesDir = join(tmpdir(), "capture-gif-frames");
const outFile = join(outDir, `${slug}.gif`);
const FRAME_DELAY = 800; // ms to wait after each slider change
const INITIAL_WAIT = 5000; // ms to wait for OpenCV to load
const STEPS = 12; // number of slider positions per slider

// --- Capture ---

rmSync(framesDir, { recursive: true, force: true });
mkdirSync(framesDir, { recursive: true });
mkdirSync(outDir, { recursive: true });

console.log(`Launching headless Firefox...`);
const browser = await firefox.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });

console.log(`Navigating to ${baseUrl}/#${slug}`);
await page.goto(`${baseUrl}/#${slug}`, { waitUntil: "networkidle" });

console.log(`Waiting ${INITIAL_WAIT / 1000}s for OpenCV to load...`);
await page.waitForTimeout(INITIAL_WAIT);

const sliders = await page.locator('input[type="range"]').all();
console.log(`Found ${sliders.length} slider(s) for "${slug}"`);

// Store original values
const originals = [];
for (const s of sliders) {
  originals.push(await s.inputValue());
}

let frame = 0;

async function screenshot() {
  const path = `${framesDir}/frame-${String(frame).padStart(4, "0")}.png`;
  await page.waitForTimeout(FRAME_DELAY);
  await page.screenshot({ path });
  console.log(`  frame ${frame}`);
  frame++;
}

// Take initial screenshot
await screenshot();

// For each slider, sweep it across its range and back
for (let si = 0; si < sliders.length; si++) {
  const slider = sliders[si];
  const min = Number(await slider.getAttribute("min"));
  const max = Number(await slider.getAttribute("max"));
  const step = Number((await slider.getAttribute("step")) || "1");

  console.log(`Sweeping slider ${si}: min=${min} max=${max} step=${step}`);

  const values = [];
  const range = max - min;
  for (let i = 0; i <= STEPS; i++) {
    const raw = min + (range * i) / STEPS;
    const snapped = Math.round(raw / step) * step;
    values.push(Math.min(snapped, max));
  }

  // Forward sweep
  for (const val of values) {
    await slider.fill(String(val));
    await slider.dispatchEvent("input");
    await slider.dispatchEvent("change");
    await screenshot();
  }

  // Sweep back
  for (const val of values.reverse().slice(1)) {
    await slider.fill(String(val));
    await slider.dispatchEvent("input");
    await slider.dispatchEvent("change");
    await screenshot();
  }

  // Restore original value
  await slider.fill(originals[si]);
  await slider.dispatchEvent("input");
  await slider.dispatchEvent("change");
}

await browser.close();

// Combine frames into GIF
console.log(`\nCreating GIF with ${frame} frames...`);
execSync(
  `convert -delay 8 -loop 0 ${framesDir}/frame-*.png -resize 800x ${outFile}`,
  { stdio: "inherit" }
);
// Cleanup temp frames
rmSync(framesDir, { recursive: true, force: true });

console.log(`Done: ${outFile}`);
