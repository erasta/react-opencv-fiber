# Edge & Feature Detection

### `<cvCanny>`

```tsx
<cvCanny threshold1={0} threshold2={0}>
  <cvImage src="image.jpg" />
</cvCanny>
```

| Prop | Type | Required |
|---|---|---|
| `threshold1` | `number` | yes |
| `threshold2` | `number` | yes |
| `apertureSize` | `number` |  |
| `L2gradient` | `boolean` |  |

### `<cvCornerHarris>`

```tsx
<cvCornerHarris blockSize={0} ksize={0} k={0}>
  <cvImage src="image.jpg" />
</cvCornerHarris>
```

| Prop | Type | Required |
|---|---|---|
| `blockSize` | `number` | yes |
| `ksize` | `number` | yes |
| `k` | `number` | yes |
| `borderType` | `number` |  |

### `<cvCornerMinEigenVal>`

```tsx
<cvCornerMinEigenVal blockSize={0}>
  <cvImage src="image.jpg" />
</cvCornerMinEigenVal>
```

| Prop | Type | Required |
|---|---|---|
| `blockSize` | `number` | yes |
| `ksize` | `number` |  |
| `borderType` | `number` |  |

### `<cvGoodFeaturesToTrack>`

```tsx
<cvGoodFeaturesToTrack maxCorners={0} qualityLevel={0} minDistance={0}>
  <cvImage src="image.jpg" />
</cvGoodFeaturesToTrack>
```

| Prop | Type | Required |
|---|---|---|
| `maxCorners` | `number` | yes |
| `qualityLevel` | `number` | yes |
| `minDistance` | `number` | yes |
| `blockSize` | `number` |  |
| `useHarrisDetector` | `boolean` |  |
| `k` | `number` |  |

### `<cvHoughCircles>`

```tsx
<cvHoughCircles method={0} dp={0} minDist={0}>
  <cvImage src="image.jpg" />
</cvHoughCircles>
```

| Prop | Type | Required |
|---|---|---|
| `method` | `number` | yes |
| `dp` | `number` | yes |
| `minDist` | `number` | yes |
| `param1` | `number` |  |
| `param2` | `number` |  |
| `minRadius` | `number` |  |
| `maxRadius` | `number` |  |

### `<cvHoughLines>`

```tsx
<cvHoughLines rho={0} theta={0} threshold={0}>
  <cvImage src="image.jpg" />
</cvHoughLines>
```

| Prop | Type | Required |
|---|---|---|
| `rho` | `number` | yes |
| `theta` | `number` | yes |
| `threshold` | `number` | yes |
| `srn` | `number` |  |
| `stn` | `number` |  |
| `min_theta` | `number` |  |
| `max_theta` | `number` |  |
| `use_edgeval` | `boolean` |  |

### `<cvHoughLinesP>`

```tsx
<cvHoughLinesP rho={0} theta={0} threshold={0}>
  <cvImage src="image.jpg" />
</cvHoughLinesP>
```

| Prop | Type | Required |
|---|---|---|
| `rho` | `number` | yes |
| `theta` | `number` | yes |
| `threshold` | `number` | yes |
| `minLineLength` | `number` |  |
| `maxLineGap` | `number` |  |
