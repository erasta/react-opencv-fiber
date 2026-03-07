# Geometric Transforms

### `<cvFlip>`

```tsx
<cvFlip flipCode={0}>
  <cvImage src="image.jpg" />
</cvFlip>
```

| Prop | Type | Required |
|---|---|---|
| `flipCode` | `number` | yes |

### `<cvGetAffineTransform>`

```tsx
<cvGetAffineTransform>
  <cvImage src="image.jpg" />
</cvGetAffineTransform>
```

### `<cvGetPerspectiveTransform>`

```tsx
<cvGetPerspectiveTransform>
  <cvImage src="image.jpg" />
</cvGetPerspectiveTransform>
```

| Prop | Type | Required |
|---|---|---|
| `solveMethod` | `number` |  |

### `<cvGetRotationMatrix2D>`

```tsx
<cvGetRotationMatrix2D center={0} angle={0} scale={0}>
  <cvImage src="image.jpg" />
</cvGetRotationMatrix2D>
```

| Prop | Type | Required |
|---|---|---|
| `center` | `Point2f` | yes |
| `angle` | `number` | yes |
| `scale` | `number` | yes |

### `<cvRemap>`

```tsx
<cvRemap interpolation={0}>
  <cvImage src="image.jpg" />
</cvRemap>
```

| Prop | Type | Required |
|---|---|---|
| `interpolation` | `number` | yes |
| `borderMode` | `number` |  |
| `borderValue` | `[v0, v1?, v2?, v3?]` |  |

### `<cvResize>`

```tsx
<cvResize dsize={[5, 5]}>
  <cvImage src="image.jpg" />
</cvResize>
```

| Prop | Type | Required |
|---|---|---|
| `dsize` | `[w, h]` | yes |
| `fx` | `number` |  |
| `fy` | `number` |  |
| `interpolation` | `number` |  |

### `<cvRotate>`

```tsx
<cvRotate rotateCode={0}>
  <cvImage src="image.jpg" />
</cvRotate>
```

| Prop | Type | Required |
|---|---|---|
| `rotateCode` | `number` | yes |

### `<cvWarpAffine>`

```tsx
<cvWarpAffine dsize={[5, 5]}>
  <cvImage src="image.jpg" />
</cvWarpAffine>
```

| Prop | Type | Required |
|---|---|---|
| `dsize` | `[w, h]` | yes |
| `flags` | `number` |  |
| `borderMode` | `number` |  |
| `borderValue` | `[v0, v1?, v2?, v3?]` |  |

### `<cvWarpPerspective>`

```tsx
<cvWarpPerspective dsize={[5, 5]}>
  <cvImage src="image.jpg" />
</cvWarpPerspective>
```

| Prop | Type | Required |
|---|---|---|
| `dsize` | `[w, h]` | yes |
| `flags` | `number` |  |
| `borderMode` | `number` |  |
| `borderValue` | `[v0, v1?, v2?, v3?]` |  |

### `<cvWarpPolar>`

```tsx
<cvWarpPolar dsize={[5, 5]} center={0} maxRadius={0} flags={0}>
  <cvImage src="image.jpg" />
</cvWarpPolar>
```

| Prop | Type | Required |
|---|---|---|
| `dsize` | `[w, h]` | yes |
| `center` | `Point2f` | yes |
| `maxRadius` | `number` | yes |
| `flags` | `number` | yes |
