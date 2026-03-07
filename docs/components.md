# Components

## `<OpenCvProvider>`

Loads OpenCV.js (WASM, ~8 MB) and provides it via React context. Must wrap any component that uses `<CvCanvas>` or `useOpenCv()`.

```tsx
<OpenCvProvider>
  <App />
</OpenCvProvider>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `openCvVersion` | `string` | `"4.9.0"` | OpenCV.js version to load from the CDN |
| `openCvPath` | `string` | `""` | Custom URL to load OpenCV.js from (overrides version) |
| `debug` | `CvDebugConfig` | see below | Debug and validation settings |

### `CvDebugConfig`

```ts
interface CvDebugConfig {
  validateOps?: boolean;    // Check ops exist at load time (default: true)
  warnMissingOps?: boolean; // Log missing ops to console (default: true)
  logPipeline?: boolean;    // Log each pipeline step (default: false)
}
```

## `useOpenCv()`

Hook to access the OpenCV instance and loading state.

```tsx
const { cv, loaded, loading, error, missingOps, debug } = useOpenCv();
```

| Field | Type | Description |
|---|---|---|
| `cv` | `CV \| null` | The OpenCV.js instance, or `null` while loading |
| `loaded` | `boolean` | `true` once OpenCV.js is ready |
| `loading` | `boolean` | `true` while loading |
| `error` | `string \| null` | Error message if loading failed |
| `missingOps` | `Set<string>` | Operations missing from the loaded OpenCV.js build |
| `debug` | `CvDebugConfig` | Current debug settings |

## `<CvCanvas>`

Executes a CV pipeline defined by its children and renders the result to a `<canvas>` element.

```tsx
<CvCanvas
  style={{ maxWidth: "100%" }}
  className="my-canvas"
  onResult={(mat) => { /* cloned Mat */ }}
>
  <cvGaussianBlur ksize={[5, 5]} sigmaX={0}>
    <cvImage src="photo.jpg" />
  </cvGaussianBlur>
</CvCanvas>
```

| Prop | Type | Description |
|---|---|---|
| `children` | `ReactNode` | CV operation tree |
| `style` | `CSSProperties` | CSS styles for the canvas element |
| `className` | `string` | CSS class for the canvas element |
| `headless` | `boolean` | When `true`, runs the pipeline without rendering a canvas. Useful for producing intermediate results via `onResult`. |
| `onResult` | `(mat: Mat) => void` | Called with a **cloned** Mat after each pipeline run. The clone stays valid across re-runs. |
| `ref` | `Ref<HTMLCanvasElement>` | Forwarded to the underlying canvas element |

## `<cvImage>`

Leaf node that loads an image into a Mat. Supports URLs and data URIs.

```tsx
<cvImage src="https://example.com/photo.jpg" />
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `src` | `string` | yes | Image URL or data URI |

## `<cvMat>`

Leaf node that accepts an existing Mat as pipeline input. The mat is **cloned internally**, so the original stays valid and is never disposed by the pipeline.

```tsx
<cvMat mat={someMatFromState} />
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `mat` | `Mat` | yes | An existing Mat object |

Use this to share the output of one pipeline as input to another:

```tsx
const [blurredMat, setBlurredMat] = useState<Mat | null>(null);

{/* Headless pipeline: compute and share result */}
<CvCanvas headless onResult={setBlurredMat}>
  <cvGaussianBlur ksize={[5, 5]} sigmaX={0}>
    <cvImage src="photo.jpg" />
  </cvGaussianBlur>
</CvCanvas>

{/* Display the intermediate result */}
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

## CV operation elements

Any OpenCV function can be used as a JSX element with a `cv` prefix. Operations nest inside-out — the innermost runs first:

```tsx
<cvCanny threshold1={50} threshold2={100}>
  <cvCvtColor code={11}>
    <cvGaussianBlur ksize={[5, 5]} sigmaX={0}>
      <cvImage src="photo.jpg" />
    </cvGaussianBlur>
  </cvCvtColor>
</cvCanny>
```

Props map directly to OpenCV function parameters. Array values are coerced to the appropriate OpenCV types (`Size`, `Point`, `Scalar`).

### `__srcParam` / `__dstParam`

By default, each operation is called as `cv.op(src, dst, ...params)`. Some functions use a different argument order. Use `__srcParam` and `__dstParam` to override the position:

```tsx
<cvApplyColorMap colormap={2} __dstParam={2}>
  <cvImage src="photo.jpg" />
</cvApplyColorMap>
```
