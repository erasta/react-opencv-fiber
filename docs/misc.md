# Misc

### `<cvCopyMakeBorder>`

```tsx
<cvCopyMakeBorder top={0} bottom={0} left={0} right={0} borderType={0}>
  <cvImage src="image.jpg" />
</cvCopyMakeBorder>
```

| Prop | Type | Required |
|---|---|---|
| `top` | `number` | yes |
| `bottom` | `number` | yes |
| `left` | `number` | yes |
| `right` | `number` | yes |
| `borderType` | `number` | yes |
| `value` | `[v0, v1?, v2?, v3?]` |  |

### `<cvGetBuildInformation>`

```tsx
<cvGetBuildInformation>
  <cvImage src="image.jpg" />
</cvGetBuildInformation>
```

### `<cvGetStructuringElement>`

```tsx
<cvGetStructuringElement shape={0} ksize={[5, 5]}>
  <cvImage src="image.jpg" />
</cvGetStructuringElement>
```

| Prop | Type | Required |
|---|---|---|
| `shape` | `number` | yes |
| `ksize` | `[w, h]` | yes |
| `anchor` | `[x, y]` |  |

### `<cvGroupRectangles>`

```tsx
<cvGroupRectangles rectList={0} groupThreshold={0}>
  <cvImage src="image.jpg" />
</cvGroupRectangles>
```

| Prop | Type | Required |
|---|---|---|
| `rectList` | `Sequence` | yes |
| `groupThreshold` | `number` | yes |
| `eps` | `number` |  |

### `<cvIntegral>`

```tsx
<cvIntegral>
  <cvImage src="image.jpg" />
</cvIntegral>
```

| Prop | Type | Required |
|---|---|---|
| `sdepth` | `number` |  |

### `<cvIntegral2>`

```tsx
<cvIntegral2>
  <cvImage src="image.jpg" />
</cvIntegral2>
```

| Prop | Type | Required |
|---|---|---|
| `sdepth` | `number` |  |
| `sqdepth` | `number` |  |

### `<cvLUT>`

```tsx
<cvLUT>
  <cvImage src="image.jpg" />
</cvLUT>
```

### `<cvRandn>`

```tsx
<cvRandn>
  <cvImage src="image.jpg" />
</cvRandn>
```

### `<cvRandu>`

```tsx
<cvRandu>
  <cvImage src="image.jpg" />
</cvRandu>
```

### `<cvSetRNGSeed>`

```tsx
<cvSetRNGSeed seed={0}>
  <cvImage src="image.jpg" />
</cvSetRNGSeed>
```

| Prop | Type | Required |
|---|---|---|
| `seed` | `number` | yes |

### `<cvSolvePoly>`

```tsx
<cvSolvePoly>
  <cvImage src="image.jpg" />
</cvSolvePoly>
```

| Prop | Type | Required |
|---|---|---|
| `maxIters` | `number` |  |
