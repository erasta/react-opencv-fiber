# Image Filtering

### `<cvBilateralFilter>`

```tsx
<cvBilateralFilter d={0} sigmaColor={0} sigmaSpace={0}>
  <cvImage src="image.jpg" />
</cvBilateralFilter>
```

| Prop | Type | Required |
|---|---|---|
| `d` | `number` | yes |
| `sigmaColor` | `number` | yes |
| `sigmaSpace` | `number` | yes |
| `borderType` | `number` |  |

### `<cvBlur>`

```tsx
<cvBlur ksize={[5, 5]}>
  <cvImage src="image.jpg" />
</cvBlur>
```

| Prop | Type | Required |
|---|---|---|
| `ksize` | `[w, h]` | yes |
| `anchor` | `[x, y]` |  |
| `borderType` | `number` |  |

### `<cvBoxFilter>`

```tsx
<cvBoxFilter ddepth={0} ksize={[5, 5]}>
  <cvImage src="image.jpg" />
</cvBoxFilter>
```

| Prop | Type | Required |
|---|---|---|
| `ddepth` | `number` | yes |
| `ksize` | `[w, h]` | yes |
| `anchor` | `[x, y]` |  |
| `normalize` | `boolean` |  |
| `borderType` | `number` |  |

### `<cvDilate>`

```tsx
<cvDilate>
  <cvImage src="image.jpg" />
</cvDilate>
```

| Prop | Type | Required |
|---|---|---|
| `anchor` | `[x, y]` |  |
| `iterations` | `number` |  |
| `borderType` | `number` |  |
| `borderValue` | `[v0, v1?, v2?, v3?]` |  |

### `<cvErode>`

```tsx
<cvErode>
  <cvImage src="image.jpg" />
</cvErode>
```

| Prop | Type | Required |
|---|---|---|
| `anchor` | `[x, y]` |  |
| `iterations` | `number` |  |
| `borderType` | `number` |  |
| `borderValue` | `[v0, v1?, v2?, v3?]` |  |

### `<cvFilter2D>`

```tsx
<cvFilter2D ddepth={0}>
  <cvImage src="image.jpg" />
</cvFilter2D>
```

| Prop | Type | Required |
|---|---|---|
| `ddepth` | `number` | yes |
| `anchor` | `[x, y]` |  |
| `delta` | `number` |  |
| `borderType` | `number` |  |

### `<cvGaussianBlur>`

```tsx
<cvGaussianBlur ksize={[5, 5]} sigmaX={0}>
  <cvImage src="image.jpg" />
</cvGaussianBlur>
```

| Prop | Type | Required |
|---|---|---|
| `ksize` | `[w, h]` | yes |
| `sigmaX` | `number` | yes |
| `sigmaY` | `number` |  |
| `borderType` | `number` |  |
| `hint` | `AlgorithmHint` |  |

### `<cvLaplacian>`

```tsx
<cvLaplacian ddepth={0}>
  <cvImage src="image.jpg" />
</cvLaplacian>
```

| Prop | Type | Required |
|---|---|---|
| `ddepth` | `number` | yes |
| `ksize` | `number` |  |
| `scale` | `number` |  |
| `delta` | `number` |  |
| `borderType` | `number` |  |

### `<cvMedianBlur>`

```tsx
<cvMedianBlur ksize={0}>
  <cvImage src="image.jpg" />
</cvMedianBlur>
```

| Prop | Type | Required |
|---|---|---|
| `ksize` | `number` | yes |

### `<cvMorphologyEx>`

```tsx
<cvMorphologyEx op={0}>
  <cvImage src="image.jpg" />
</cvMorphologyEx>
```

| Prop | Type | Required |
|---|---|---|
| `op` | `number` | yes |
| `anchor` | `[x, y]` |  |
| `iterations` | `number` |  |
| `borderType` | `number` |  |
| `borderValue` | `[v0, v1?, v2?, v3?]` |  |

### `<cvPyrDown>`

```tsx
<cvPyrDown>
  <cvImage src="image.jpg" />
</cvPyrDown>
```

| Prop | Type | Required |
|---|---|---|
| `dstsize` | `[w, h]` |  |
| `borderType` | `number` |  |

### `<cvPyrUp>`

```tsx
<cvPyrUp>
  <cvImage src="image.jpg" />
</cvPyrUp>
```

| Prop | Type | Required |
|---|---|---|
| `dstsize` | `[w, h]` |  |
| `borderType` | `number` |  |

### `<cvScharr>`

```tsx
<cvScharr ddepth={0} dx={0} dy={0}>
  <cvImage src="image.jpg" />
</cvScharr>
```

| Prop | Type | Required |
|---|---|---|
| `ddepth` | `number` | yes |
| `dx` | `number` | yes |
| `dy` | `number` | yes |
| `scale` | `number` |  |
| `delta` | `number` |  |
| `borderType` | `number` |  |

### `<cvSepFilter2D>`

```tsx
<cvSepFilter2D ddepth={0}>
  <cvImage src="image.jpg" />
</cvSepFilter2D>
```

| Prop | Type | Required |
|---|---|---|
| `ddepth` | `number` | yes |
| `anchor` | `[x, y]` |  |
| `delta` | `number` |  |
| `borderType` | `number` |  |

### `<cvSobel>`

```tsx
<cvSobel ddepth={0} dx={0} dy={0}>
  <cvImage src="image.jpg" />
</cvSobel>
```

| Prop | Type | Required |
|---|---|---|
| `ddepth` | `number` | yes |
| `dx` | `number` | yes |
| `dy` | `number` | yes |
| `ksize` | `number` |  |
| `scale` | `number` |  |
| `delta` | `number` |  |
| `borderType` | `number` |  |
