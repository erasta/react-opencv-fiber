# Drawing

### `<cvCircle>`

```tsx
<cvCircle center={[0, 0]} radius={0} color={[255, 0, 0]}>
  <cvImage src="image.jpg" />
</cvCircle>
```

| Prop | Type | Required |
|---|---|---|
| `center` | `[x, y]` | yes |
| `radius` | `number` | yes |
| `color` | `[v0, v1?, v2?, v3?]` | yes |
| `thickness` | `number` |  |
| `lineType` | `number` |  |
| `shift` | `number` |  |

### `<cvDrawContours>`

```tsx
<cvDrawContours contours={0} contourIdx={0} color={[255, 0, 0]}>
  <cvImage src="image.jpg" />
</cvDrawContours>
```

| Prop | Type | Required |
|---|---|---|
| `contours` | `Sequence` | yes |
| `contourIdx` | `number` | yes |
| `color` | `[v0, v1?, v2?, v3?]` | yes |
| `thickness` | `number` |  |
| `lineType` | `number` |  |
| `maxLevel` | `number` |  |
| `offset` | `[x, y]` |  |

### `<cvEllipse>`

```tsx
<cvEllipse center={[0, 0]} axes={[5, 5]} angle={0} startAngle={0} endAngle={0} color={[255, 0, 0]}>
  <cvImage src="image.jpg" />
</cvEllipse>
```

| Prop | Type | Required |
|---|---|---|
| `center` | `[x, y]` | yes |
| `axes` | `[w, h]` | yes |
| `angle` | `number` | yes |
| `startAngle` | `number` | yes |
| `endAngle` | `number` | yes |
| `color` | `[v0, v1?, v2?, v3?]` | yes |
| `thickness` | `number` |  |
| `lineType` | `number` |  |
| `shift` | `number` |  |

### `<cvEllipse2Poly>`

```tsx
<cvEllipse2Poly center={[0, 0]} axes={[5, 5]} angle={0} arcStart={0} arcEnd={0} delta={0}>
  <cvImage src="image.jpg" />
</cvEllipse2Poly>
```

| Prop | Type | Required |
|---|---|---|
| `center` | `[x, y]` | yes |
| `axes` | `[w, h]` | yes |
| `angle` | `number` | yes |
| `arcStart` | `number` | yes |
| `arcEnd` | `number` | yes |
| `delta` | `number` | yes |

### `<cvFillConvexPoly>`

```tsx
<cvFillConvexPoly color={[255, 0, 0]}>
  <cvImage src="image.jpg" />
</cvFillConvexPoly>
```

| Prop | Type | Required |
|---|---|---|
| `color` | `[v0, v1?, v2?, v3?]` | yes |
| `lineType` | `number` |  |
| `shift` | `number` |  |

### `<cvFillPoly>`

```tsx
<cvFillPoly pts={0} color={[255, 0, 0]}>
  <cvImage src="image.jpg" />
</cvFillPoly>
```

| Prop | Type | Required |
|---|---|---|
| `pts` | `Sequence` | yes |
| `color` | `[v0, v1?, v2?, v3?]` | yes |
| `lineType` | `number` |  |
| `shift` | `number` |  |
| `offset` | `[x, y]` |  |

### `<cvLine>`

```tsx
<cvLine pt1={[0, 0]} pt2={[0, 0]} color={[255, 0, 0]}>
  <cvImage src="image.jpg" />
</cvLine>
```

| Prop | Type | Required |
|---|---|---|
| `pt1` | `[x, y]` | yes |
| `pt2` | `[x, y]` | yes |
| `color` | `[v0, v1?, v2?, v3?]` | yes |
| `thickness` | `number` |  |
| `lineType` | `number` |  |
| `shift` | `number` |  |

### `<cvPolylines>`

```tsx
<cvPolylines pts={0} isClosed={false} color={[255, 0, 0]}>
  <cvImage src="image.jpg" />
</cvPolylines>
```

| Prop | Type | Required |
|---|---|---|
| `pts` | `Sequence` | yes |
| `isClosed` | `boolean` | yes |
| `color` | `[v0, v1?, v2?, v3?]` | yes |
| `thickness` | `number` |  |
| `lineType` | `number` |  |
| `shift` | `number` |  |

### `<cvPutText>`

```tsx
<cvPutText text={0} org={[0, 0]} fontFace={0} fontScale={0} color={[255, 0, 0]}>
  <cvImage src="image.jpg" />
</cvPutText>
```

| Prop | Type | Required |
|---|---|---|
| `text` | `str` | yes |
| `org` | `[x, y]` | yes |
| `fontFace` | `number` | yes |
| `fontScale` | `number` | yes |
| `color` | `[v0, v1?, v2?, v3?]` | yes |
| `thickness` | `number` |  |
| `lineType` | `number` |  |
| `bottomLeftOrigin` | `boolean` |  |

### `<cvRectangle>`

```tsx
<cvRectangle pt1={[0, 0]} pt2={[0, 0]} color={[255, 0, 0]}>
  <cvImage src="image.jpg" />
</cvRectangle>
```

| Prop | Type | Required |
|---|---|---|
| `pt1` | `[x, y]` | yes |
| `pt2` | `[x, y]` | yes |
| `color` | `[v0, v1?, v2?, v3?]` | yes |
| `thickness` | `number` |  |
| `lineType` | `number` |  |
| `shift` | `number` |  |
