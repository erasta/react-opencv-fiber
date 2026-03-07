# Contours

### `<cvApproxPolyDP>`

```tsx
<cvApproxPolyDP epsilon={0} closed={false}>
  <cvImage src="image.jpg" />
</cvApproxPolyDP>
```

| Prop | Type | Required |
|---|---|---|
| `epsilon` | `number` | yes |
| `closed` | `boolean` | yes |

### `<cvArcLength>`

```tsx
<cvArcLength closed={false}>
  <cvImage src="image.jpg" />
</cvArcLength>
```

| Prop | Type | Required |
|---|---|---|
| `closed` | `boolean` | yes |

### `<cvBoundingRect>`

```tsx
<cvBoundingRect>
  <cvImage src="image.jpg" />
</cvBoundingRect>
```

### `<cvConnectedComponents>`

```tsx
<cvConnectedComponents>
  <cvImage src="image.jpg" />
</cvConnectedComponents>
```

| Prop | Type | Required |
|---|---|---|
| `connectivity` | `number` |  |
| `ltype` | `number` |  |

### `<cvConnectedComponentsWithStats>`

```tsx
<cvConnectedComponentsWithStats>
  <cvImage src="image.jpg" />
</cvConnectedComponentsWithStats>
```

| Prop | Type | Required |
|---|---|---|
| `connectivity` | `number` |  |
| `ltype` | `number` |  |

### `<cvContourArea>`

```tsx
<cvContourArea>
  <cvImage src="image.jpg" />
</cvContourArea>
```

| Prop | Type | Required |
|---|---|---|
| `oriented` | `boolean` |  |

### `<cvConvexHull>`

```tsx
<cvConvexHull>
  <cvImage src="image.jpg" />
</cvConvexHull>
```

| Prop | Type | Required |
|---|---|---|
| `clockwise` | `boolean` |  |
| `returnPoints` | `boolean` |  |

### `<cvConvexityDefects>`

```tsx
<cvConvexityDefects>
  <cvImage src="image.jpg" />
</cvConvexityDefects>
```

### `<cvFindContours>`

```tsx
<cvFindContours mode={0} method={0}>
  <cvImage src="image.jpg" />
</cvFindContours>
```

| Prop | Type | Required |
|---|---|---|
| `mode` | `number` | yes |
| `method` | `number` | yes |
| `contours` | `Sequence` |  |
| `offset` | `[x, y]` |  |

### `<cvFitEllipse>`

```tsx
<cvFitEllipse>
  <cvImage src="image.jpg" />
</cvFitEllipse>
```

### `<cvFitLine>`

```tsx
<cvFitLine distType={0} param={0} reps={0} aeps={0}>
  <cvImage src="image.jpg" />
</cvFitLine>
```

| Prop | Type | Required |
|---|---|---|
| `distType` | `number` | yes |
| `param` | `number` | yes |
| `reps` | `number` | yes |
| `aeps` | `number` | yes |

### `<cvIsContourConvex>`

```tsx
<cvIsContourConvex>
  <cvImage src="image.jpg" />
</cvIsContourConvex>
```

### `<cvMatchShapes>`

```tsx
<cvMatchShapes method={0} parameter={0}>
  <cvImage src="image.jpg" />
</cvMatchShapes>
```

| Prop | Type | Required |
|---|---|---|
| `method` | `number` | yes |
| `parameter` | `number` | yes |

### `<cvMinAreaRect>`

```tsx
<cvMinAreaRect>
  <cvImage src="image.jpg" />
</cvMinAreaRect>
```

### `<cvMinEnclosingCircle>`

```tsx
<cvMinEnclosingCircle>
  <cvImage src="image.jpg" />
</cvMinEnclosingCircle>
```

### `<cvMoments>`

```tsx
<cvMoments>
  <cvImage src="image.jpg" />
</cvMoments>
```

| Prop | Type | Required |
|---|---|---|
| `binaryImage` | `boolean` |  |

### `<cvPointPolygonTest>`

```tsx
<cvPointPolygonTest pt={0} measureDist={false}>
  <cvImage src="image.jpg" />
</cvPointPolygonTest>
```

| Prop | Type | Required |
|---|---|---|
| `pt` | `Point2f` | yes |
| `measureDist` | `boolean` | yes |
