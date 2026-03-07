# Feature Matching

### `<cvDrawKeypoints>`

```tsx
<cvDrawKeypoints keypoints={0}>
  <cvImage src="image.jpg" />
</cvDrawKeypoints>
```

| Prop | Type | Required |
|---|---|---|
| `keypoints` | `Sequence` | yes |
| `color` | `[v0, v1?, v2?, v3?]` |  |
| `flags` | `DrawMatchesFlags` |  |

### `<cvDrawMatches>`

```tsx
<cvDrawMatches keypoints1={0} keypoints2={0} matches1to2={0}>
  <cvImage src="image.jpg" />
</cvDrawMatches>
```

| Prop | Type | Required |
|---|---|---|
| `keypoints1` | `Sequence` | yes |
| `keypoints2` | `Sequence` | yes |
| `matches1to2` | `Sequence` | yes |
| `matchColor` | `[v0, v1?, v2?, v3?]` |  |
| `singlePointColor` | `[v0, v1?, v2?, v3?]` |  |
| `matchesMask` | `Sequence` |  |
| `flags` | `DrawMatchesFlags` |  |

### `<cvDrawMatchesKnn>`

```tsx
<cvDrawMatchesKnn keypoints1={0} keypoints2={0} matches1to2={0}>
  <cvImage src="image.jpg" />
</cvDrawMatchesKnn>
```

| Prop | Type | Required |
|---|---|---|
| `keypoints1` | `Sequence` | yes |
| `keypoints2` | `Sequence` | yes |
| `matches1to2` | `Sequence` | yes |
| `matchColor` | `[v0, v1?, v2?, v3?]` |  |
| `singlePointColor` | `[v0, v1?, v2?, v3?]` |  |
| `matchesMask` | `Sequence` |  |
| `flags` | `DrawMatchesFlags` |  |
