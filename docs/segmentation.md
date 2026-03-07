# Segmentation

### `<cvDistanceTransform>`

```tsx
<cvDistanceTransform distanceType={0} maskSize={0}>
  <cvImage src="image.jpg" />
</cvDistanceTransform>
```

| Prop | Type | Required |
|---|---|---|
| `distanceType` | `number` | yes |
| `maskSize` | `number` | yes |
| `dstType` | `number` |  |

### `<cvDistanceTransformWithLabels>`

```tsx
<cvDistanceTransformWithLabels distanceType={0} maskSize={0}>
  <cvImage src="image.jpg" />
</cvDistanceTransformWithLabels>
```

| Prop | Type | Required |
|---|---|---|
| `distanceType` | `number` | yes |
| `maskSize` | `number` | yes |
| `labelType` | `number` |  |

### `<cvFloodFill>`

```tsx
<cvFloodFill seedPoint={[0, 0]} newVal={[255, 0, 0]}>
  <cvImage src="image.jpg" />
</cvFloodFill>
```

| Prop | Type | Required |
|---|---|---|
| `seedPoint` | `[x, y]` | yes |
| `newVal` | `[v0, v1?, v2?, v3?]` | yes |
| `loDiff` | `[v0, v1?, v2?, v3?]` |  |
| `upDiff` | `[v0, v1?, v2?, v3?]` |  |
| `flags` | `number` |  |

### `<cvGrabCut>`

```tsx
<cvGrabCut rect={0} iterCount={0}>
  <cvImage src="image.jpg" />
</cvGrabCut>
```

| Prop | Type | Required |
|---|---|---|
| `rect` | `Rect` | yes |
| `iterCount` | `number` | yes |
| `mode` | `number` |  |

### `<cvWatershed>`

```tsx
<cvWatershed>
  <cvImage src="image.jpg" />
</cvWatershed>
```
