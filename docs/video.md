# Optical Flow & Video

### `<cvCamShift>`

```tsx
<cvCamShift window={0} criteria={0}>
  <cvImage src="image.jpg" />
</cvCamShift>
```

| Prop | Type | Required |
|---|---|---|
| `window` | `Rect` | yes |
| `criteria` | `TermCriteria` | yes |

### `<cvCalcOpticalFlowFarneback>`

```tsx
<cvCalcOpticalFlowFarneback pyr_scale={0} levels={0} winsize={0} iterations={0} poly_n={0} poly_sigma={0} flags={0}>
  <cvImage src="image.jpg" />
</cvCalcOpticalFlowFarneback>
```

| Prop | Type | Required |
|---|---|---|
| `pyr_scale` | `number` | yes |
| `levels` | `number` | yes |
| `winsize` | `number` | yes |
| `iterations` | `number` | yes |
| `poly_n` | `number` | yes |
| `poly_sigma` | `number` | yes |
| `flags` | `number` | yes |

### `<cvCalcOpticalFlowPyrLK>`

```tsx
<cvCalcOpticalFlowPyrLK>
  <cvImage src="image.jpg" />
</cvCalcOpticalFlowPyrLK>
```

| Prop | Type | Required |
|---|---|---|
| `winSize` | `[w, h]` |  |
| `maxLevel` | `number` |  |
| `criteria` | `TermCriteria` |  |
| `flags` | `number` |  |
| `minEigThreshold` | `number` |  |

### `<cvMeanShift>`

```tsx
<cvMeanShift window={0} criteria={0}>
  <cvImage src="image.jpg" />
</cvMeanShift>
```

| Prop | Type | Required |
|---|---|---|
| `window` | `Rect` | yes |
| `criteria` | `TermCriteria` | yes |
