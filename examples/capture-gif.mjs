#!/usr/bin/env node
import { firefox } from "playwright";
import { execSync } from "child_process";
import { mkdirSync, rmSync } from "fs";

const slug = process.argv[2] || "canny-gaussian";
const baseUrl = process.argv[3] || "http://localhost:5199";
const framesDir = "/tmp/gif-frames";
const outFile = `/tmp/${slug}.gif`;
const FRAME_DELAY = 800; // ms to wait after each slider change
const INITIAL_WAIT = 5000; // ms to wait for OpenCV to load
const STEPS = 12; // number of slider positions per slider

rmSync(framesDir, { recursive: true, force: true });
mkdirSync(framesDir, { recursive: true });

const browser = await firefox.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto(`${baseUrl}/#${slug}`, { waitUntil: "networkidle" });
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

  console.log(`Slider ${si}: min=${min} max=${max} step=${step}`);

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
console.log(`Done: ${outFile}`);
