#!/usr/bin/env node
import { execSync } from "child_process";
import { mkdirSync, rmSync } from "fs";
import { createConnection } from "net";
import { tmpdir } from "os";
import { join } from "path";
import { parseArgs } from "util";

// --- Parse args ---

const { values: args } = parseArgs({
  options: {
    slug:    { type: "string",  short: "s" },
    all:     { type: "boolean", short: "a", default: false },
    port:    { type: "string",  short: "p", default: "5199" },
    outdir:  { type: "string",  short: "o", default: "gifs" },
    steps:   { type: "string",  short: "n", default: "12" },
    delay:   { type: "string",  short: "d", default: "800" },
    wait:    { type: "string",  short: "w", default: "5000" },
    help:    { type: "boolean", short: "h", default: false },
  },
  strict: true,
});

if (args.help || (!args.slug && !args.all)) {
  console.log(`Usage: node capture-gif.mjs [options]

Options:
  -s, --slug <name>    Example slug to capture
  -a, --all            Capture all examples
  -p, --port <number>  Dev server port (default: 5199)
  -o, --outdir <path>  Output directory for GIFs (default: gifs)
  -n, --steps <number> Slider positions per sweep (default: 12)
  -d, --delay <ms>     Delay after each slider change (default: 800)
  -w, --wait <ms>      Initial wait for OpenCV to load (default: 5000)
  -h, --help           Show this help`);
  process.exit(0);
}

const port = Number(args.port);
const outDir = args.outdir;
const STEPS = Number(args.steps);
const FRAME_DELAY = Number(args.delay);
const INITIAL_WAIT = Number(args.wait);
const baseUrl = `http://localhost:${port}`;
const framesDir = join(tmpdir(), "capture-gif-frames");

// --- Preflight checks ---

try {
  execSync("which convert", { stdio: "ignore" });
} catch {
  console.error("Error: 'convert' (ImageMagick) not found. Install it with: sudo apt install imagemagick");
  process.exit(1);
}

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

// --- Discover slugs ---

let slugs;
if (args.all) {
  console.log(`Discovering examples from ${baseUrl}...`);
  const browser = await firefox.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  slugs = await page.locator('a[href^="#"]').evaluateAll((links) =>
    links.map((a) => a.getAttribute("href").replace(/^#/, "")).filter(Boolean)
  );
  await browser.close();
  console.log(`Found ${slugs.length} examples: ${slugs.join(", ")}`);
} else {
  slugs = [args.slug];
}

// --- Capture ---

mkdirSync(outDir, { recursive: true });

async function captureExample(slug) {
  const outFile = join(outDir, `${slug}.gif`);

  rmSync(framesDir, { recursive: true, force: true });
  mkdirSync(framesDir, { recursive: true });

  console.log(`\n=== ${slug} ===`);
  console.log(`Launching headless Firefox...`);
  const browser = await firefox.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  console.log(`Navigating to ${baseUrl}/#${slug}`);
  await page.goto(`${baseUrl}/#${slug}`, { waitUntil: "networkidle" });

  console.log(`Waiting ${INITIAL_WAIT / 1000}s for OpenCV to load...`);
  await page.waitForTimeout(INITIAL_WAIT);

  const sliders = await page.locator('input[type="range"]').all();
  console.log(`Found ${sliders.length} slider(s)`);

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

  await screenshot();

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

    for (const val of values) {
      await slider.fill(String(val));
      await slider.dispatchEvent("input");
      await slider.dispatchEvent("change");
      await screenshot();
    }

    for (const val of values.reverse().slice(1)) {
      await slider.fill(String(val));
      await slider.dispatchEvent("input");
      await slider.dispatchEvent("change");
      await screenshot();
    }

    await slider.fill(originals[si]);
    await slider.dispatchEvent("input");
    await slider.dispatchEvent("change");
  }

  await browser.close();

  console.log(`Creating GIF with ${frame} frames...`);
  execSync(
    `convert -delay 8 -loop 0 ${framesDir}/frame-*.png -resize 800x ${outFile}`,
    { stdio: "inherit" }
  );

  rmSync(framesDir, { recursive: true, force: true });
  console.log(`Done: ${outFile}`);
}

for (const slug of slugs) {
  await captureExample(slug);
}
