# react-opencv-fiber

[![npm version](https://img.shields.io/npm/v/@react-opencv/fiber.svg)](https://www.npmjs.com/package/@react-opencv/fiber)

A React renderer for OpenCV.js. Write image-processing pipelines as JSX — each element maps to an OpenCV operation, and the tree executes bottom-up through a custom React reconciler.

[**Live demo**](https://erasta.github.io/react-opencv-fiber/)

```tsx
<CvCanvas>
  <cvCanny threshold1={50} threshold2={100}>
    <cvCvtColor code={11}>
      <cvGaussianBlur ksize={[5, 5]} sigmaX={0}>
        <cvImage src="photo.jpg" />
      </cvGaussianBlur>
    </cvCvtColor>
  </cvCanny>
</CvCanvas>
```

## How it works

The library uses a custom React Fiber reconciler to build a tree of `CvNode`s from JSX. When the tree changes (props update, nodes added/removed), the pipeline re-executes:

1. **Leaf nodes** (`<cvImage>`) load source images into OpenCV `Mat` objects
2. **Inner nodes** (`<cvGaussianBlur>`, `<cvCanny>`, ...) receive their child's `Mat` as input, apply the corresponding `cv.*` function, and pass the result up
3. **`<CvCanvas>`** displays the final `Mat` on an HTML canvas

Intermediate `Mat` objects are automatically cleaned up to avoid WebAssembly memory leaks.

## API

### `<OpenCVProvider>`

Loads OpenCV.js (WASM, ~8 MB) and provides it via context. Wrap your app with this.

```tsx
<OpenCVProvider>
  <App />
</OpenCVProvider>
```

### `useOpenCV()`

```tsx
const { cv, loading, error } = useOpenCV();
```

### `<CvCanvas>`

Renders a `<canvas>` and executes the CV pipeline defined by its children.

```tsx
<CvCanvas
  style={{ maxWidth: "100%" }}
  className="my-canvas"
  onResult={(mat) => { /* cloned Mat of the final result */ }}
>
  {/* CV operation tree */}
</CvCanvas>
```

| Prop | Type | Description |
|---|---|---|
| `style` | `CSSProperties` | CSS styles for the canvas element |
| `className` | `string` | CSS class for the canvas element |
| `headless` | `boolean` | When `true`, runs the pipeline without rendering a canvas (returns `null`). Useful for producing intermediate results via `onResult`. |
| `onResult` | `(mat: Mat) => void` | Called with a **cloned** Mat after each pipeline run. The clone stays valid across re-runs — you own it. |
| `ref` | `Ref<HTMLCanvasElement>` | Forwarded to the underlying canvas element |

### CV operation elements

Any OpenCV function can be used as a JSX element with a `cv` prefix:

| JSX element | OpenCV function |
|---|---|
| `<cvGaussianBlur ksize={[5,5]} sigmaX={0}>` | `cv.GaussianBlur(...)` |
| `<cvCanny threshold1={50} threshold2={100}>` | `cv.Canny(...)` |
| `<cvCvtColor code={11}>` | `cv.cvtColor(...)` |
| `<cvThreshold thresh={127} maxval={255} type={0}>` | `cv.threshold(...)` |
| `<cvResize dsize={[320, 240]}>` | `cv.resize(...)` |
| `<cvMedianBlur ksize={5}>` | `cv.medianBlur(...)` |
| `<cvBilateralFilter d={9} sigmaColor={75} sigmaSpace={75}>` | `cv.bilateralFilter(...)` |

Operations are nested inside-out — the innermost element runs first:

```tsx
// Execution order: image load -> blur -> grayscale -> edge detection
<cvCanny threshold1={50} threshold2={100}>
  <cvCvtColor code={11}>
    <cvGaussianBlur ksize={[5, 5]} sigmaX={0}>
      <cvImage src="photo.jpg" />
    </cvGaussianBlur>
  </cvCvtColor>
</cvCanny>
```

Props map directly to OpenCV function parameters. Array values are coerced to the appropriate OpenCV types (`Size`, `Point`, `Scalar`).

#### `__srcParam` / `__dstParam`

By default, each operation is called as `cv.op(src, dst, ...params)` — matching the OpenCV.js convention of `src` at position 0 and `dst` at position 1. Some functions use a different argument order. Use `__srcParam` and `__dstParam` to override the position:

```tsx
{/* applyColorMap expects cv.applyColorMap(src, colormap, dst) */}
<cvApplyColorMap colormap={2} __dstParam={2}>
  <cvCvtColor code={11}>
    <cvImage src="photo.jpg" />
  </cvCvtColor>
</cvApplyColorMap>
```

### Special leaf elements

These are leaf nodes that provide input to the pipeline (they have no children).

#### `<cvImage>`

Loads an image (URL or data URI) into a `Mat`.

```tsx
<cvImage src="https://example.com/photo.jpg" />
```

#### `<cvMat>`

Accepts an existing `Mat` as pipeline input. The mat is **cloned internally**, so the original stays valid and is never disposed by the pipeline.

```tsx
<cvMat mat={someMatFromState} />
```

Use this to share the output of one pipeline as input to another (see [Sharing results between pipelines](#sharing-results-between-pipelines)).

### Sharing results between pipelines

Use `headless` mode to run a pipeline without a canvas, capture its result with `onResult`, and feed it into other pipelines via `<cvMat>`:

```tsx
const [blurredMat, setBlurredMat] = useState<Mat | null>(null);

{/* Headless pipeline: blur and share result */}
<CvCanvas headless onResult={setBlurredMat}>
  <cvGaussianBlur ksize={[5, 5]} sigmaX={0}>
    <cvImage src="photo.jpg" />
  </cvGaussianBlur>
</CvCanvas>

{/* Display the blurred intermediate */}
<CvCanvas>
  <cvMat mat={blurredMat} />
</CvCanvas>

{/* Apply further operations on the shared result */}
<CvCanvas>
  <cvCanny threshold1={50} threshold2={150}>
    <cvMat mat={blurredMat} />
  </cvCanny>
</CvCanvas>
```

Both `onResult` and `<cvMat>` clone the Mat, so there are no ownership conflicts — each pipeline manages its own memory.

## Examples

The `examples/` directory contains interactive demos with different filter combinations. [**Live demo**](https://erasta.github.io/react-opencv-fiber/)

<p>
  <img src="gifs/canny-gaussian.gif" width="400" />
  <img src="gifs/adaptive-threshold-blur.gif" width="400" />
</p>
<p>
  <img src="gifs/edge-preserving-canny.gif" width="400" />
  <img src="gifs/laplacian-blur.gif" width="400" />
</p>
<p>
  <img src="gifs/median-equalize.gif" width="400" />
</p>

To run locally:

```sh
npm install
npm run build
cd examples && npm install && npx vite
```

## Acknowledgements

- [OpenCV](https://opencv.org/) — the computer vision library that powers all the operations
- [OpenCV.js](https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html) — the JavaScript/WebAssembly port of OpenCV
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) — the inspiration for using a custom React reconciler to drive a non-DOM library

## License

[MIT](./LICENSE)
