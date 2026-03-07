# Calibration & 3D

### `<cvCalibrateCameraExtended>`

```tsx
<cvCalibrateCameraExtended objectPoints={0} imagePoints={0} imageSize={[5, 5]}>
  <cvImage src="image.jpg" />
</cvCalibrateCameraExtended>
```

| Prop | Type | Required |
|---|---|---|
| `objectPoints` | `Sequence` | yes |
| `imagePoints` | `Sequence` | yes |
| `imageSize` | `[w, h]` | yes |
| `rvecs` | `Sequence` |  |
| `tvecs` | `Sequence` |  |
| `flags` | `number` |  |
| `criteria` | `TermCriteria` |  |

### `<cvDrawFrameAxes>`

```tsx
<cvDrawFrameAxes length={0}>
  <cvImage src="image.jpg" />
</cvDrawFrameAxes>
```

| Prop | Type | Required |
|---|---|---|
| `length` | `number` | yes |
| `thickness` | `number` |  |

### `<cvEstimateAffine2D>`

```tsx
<cvEstimateAffine2D>
  <cvImage src="image.jpg" />
</cvEstimateAffine2D>
```

| Prop | Type | Required |
|---|---|---|
| `method` | `number` |  |
| `ransacReprojThreshold` | `number` |  |
| `maxIters` | `number` |  |
| `confidence` | `number` |  |
| `refineIters` | `number` |  |

### `<cvFindHomography>`

```tsx
<cvFindHomography>
  <cvImage src="image.jpg" />
</cvFindHomography>
```

| Prop | Type | Required |
|---|---|---|
| `method` | `number` |  |
| `ransacReprojThreshold` | `number` |  |
| `maxIters` | `number` |  |
| `confidence` | `number` |  |

### `<cvFindTransformECC>`

```tsx
<cvFindTransformECC motionType={0} criteria={0} gaussFiltSize={0}>
  <cvImage src="image.jpg" />
</cvFindTransformECC>
```

| Prop | Type | Required |
|---|---|---|
| `motionType` | `number` | yes |
| `criteria` | `TermCriteria` | yes |
| `gaussFiltSize` | `number` | yes |

### `<cvGetDefaultNewCameraMatrix>`

```tsx
<cvGetDefaultNewCameraMatrix>
  <cvImage src="image.jpg" />
</cvGetDefaultNewCameraMatrix>
```

| Prop | Type | Required |
|---|---|---|
| `imgsize` | `[w, h]` |  |
| `centerPrincipalPoint` | `boolean` |  |

### `<cvInitUndistortRectifyMap>`

```tsx
<cvInitUndistortRectifyMap size={[5, 5]} m1type={0}>
  <cvImage src="image.jpg" />
</cvInitUndistortRectifyMap>
```

| Prop | Type | Required |
|---|---|---|
| `size` | `[w, h]` | yes |
| `m1type` | `number` | yes |

### `<cvProjectPoints>`

```tsx
<cvProjectPoints>
  <cvImage src="image.jpg" />
</cvProjectPoints>
```

| Prop | Type | Required |
|---|---|---|
| `aspectRatio` | `number` |  |

### `<cvRodrigues>`

```tsx
<cvRodrigues>
  <cvImage src="image.jpg" />
</cvRodrigues>
```

### `<cvSolvePnP>`

```tsx
<cvSolvePnP>
  <cvImage src="image.jpg" />
</cvSolvePnP>
```

| Prop | Type | Required |
|---|---|---|
| `useExtrinsicGuess` | `boolean` |  |
| `flags` | `number` |  |

### `<cvSolvePnPRansac>`

```tsx
<cvSolvePnPRansac>
  <cvImage src="image.jpg" />
</cvSolvePnPRansac>
```

| Prop | Type | Required |
|---|---|---|
| `useExtrinsicGuess` | `boolean` |  |
| `iterationsCount` | `number` |  |
| `reprojectionError` | `number` |  |
| `confidence` | `number` |  |
| `flags` | `number` |  |

### `<cvSolvePnPRefineLM>`

```tsx
<cvSolvePnPRefineLM>
  <cvImage src="image.jpg" />
</cvSolvePnPRefineLM>
```

| Prop | Type | Required |
|---|---|---|
| `criteria` | `TermCriteria` |  |

### `<cvUndistort>`

```tsx
<cvUndistort>
  <cvImage src="image.jpg" />
</cvUndistort>
```
