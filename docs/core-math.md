# Core / Math

### `<cvCartToPolar>`

```tsx
<cvCartToPolar>
  <cvImage src="image.jpg" />
</cvCartToPolar>
```

| Prop | Type | Required |
|---|---|---|
| `angleInDegrees` | `boolean` |  |

### `<cvCountNonZero>`

```tsx
<cvCountNonZero>
  <cvImage src="image.jpg" />
</cvCountNonZero>
```

### `<cvDft>`

```tsx
<cvDft>
  <cvImage src="image.jpg" />
</cvDft>
```

| Prop | Type | Required |
|---|---|---|
| `flags` | `number` |  |
| `nonzeroRows` | `number` |  |

### `<cvDeterminant>`

```tsx
<cvDeterminant>
  <cvImage src="image.jpg" />
</cvDeterminant>
```

### `<cvEigen>`

```tsx
<cvEigen>
  <cvImage src="image.jpg" />
</cvEigen>
```

### `<cvExp>`

```tsx
<cvExp>
  <cvImage src="image.jpg" />
</cvExp>
```

### `<cvGemm>`

```tsx
<cvGemm alpha={0} beta={0}>
  <cvImage src="image.jpg" />
</cvGemm>
```

| Prop | Type | Required |
|---|---|---|
| `alpha` | `number` | yes |
| `beta` | `number` | yes |
| `flags` | `number` |  |

### `<cvGetOptimalDFTSize>`

```tsx
<cvGetOptimalDFTSize vecsize={0}>
  <cvImage src="image.jpg" />
</cvGetOptimalDFTSize>
```

| Prop | Type | Required |
|---|---|---|
| `vecsize` | `number` | yes |

### `<cvHconcat>`

```tsx
<cvHconcat src={0}>
  <cvImage src="image.jpg" />
</cvHconcat>
```

| Prop | Type | Required |
|---|---|---|
| `src` | `Sequence` | yes |

### `<cvInRange>`

```tsx
<cvInRange>
  <cvImage src="image.jpg" />
</cvInRange>
```

### `<cvInvert>`

```tsx
<cvInvert>
  <cvImage src="image.jpg" />
</cvInvert>
```

| Prop | Type | Required |
|---|---|---|
| `flags` | `number` |  |

### `<cvKmeans>`

```tsx
<cvKmeans K={0} criteria={0} attempts={0} flags={0}>
  <cvImage src="image.jpg" />
</cvKmeans>
```

| Prop | Type | Required |
|---|---|---|
| `K` | `number` | yes |
| `criteria` | `TermCriteria` | yes |
| `attempts` | `number` | yes |
| `flags` | `number` | yes |

### `<cvLog>`

```tsx
<cvLog>
  <cvImage src="image.jpg" />
</cvLog>
```

### `<cvMagnitude>`

```tsx
<cvMagnitude>
  <cvImage src="image.jpg" />
</cvMagnitude>
```

### `<cvMean>`

```tsx
<cvMean>
  <cvImage src="image.jpg" />
</cvMean>
```

### `<cvMeanStdDev>`

```tsx
<cvMeanStdDev>
  <cvImage src="image.jpg" />
</cvMeanStdDev>
```

### `<cvMerge>`

```tsx
<cvMerge mv={0}>
  <cvImage src="image.jpg" />
</cvMerge>
```

| Prop | Type | Required |
|---|---|---|
| `mv` | `Sequence` | yes |

### `<cvMinMaxLoc>`

```tsx
<cvMinMaxLoc>
  <cvImage src="image.jpg" />
</cvMinMaxLoc>
```

### `<cvMixChannels>`

```tsx
<cvMixChannels src={0} dst={0} fromTo={0}>
  <cvImage src="image.jpg" />
</cvMixChannels>
```

| Prop | Type | Required |
|---|---|---|
| `src` | `Sequence` | yes |
| `dst` | `Sequence` | yes |
| `fromTo` | `Sequence` | yes |

### `<cvNorm>`

```tsx
<cvNorm>
  <cvImage src="image.jpg" />
</cvNorm>
```

| Prop | Type | Required |
|---|---|---|
| `normType` | `number` |  |

### `<cvNormalize>`

```tsx
<cvNormalize>
  <cvImage src="image.jpg" />
</cvNormalize>
```

| Prop | Type | Required |
|---|---|---|
| `alpha` | `number` |  |
| `beta` | `number` |  |
| `norm_type` | `number` |  |
| `dtype` | `number` |  |

### `<cvPerspectiveTransform>`

```tsx
<cvPerspectiveTransform>
  <cvImage src="image.jpg" />
</cvPerspectiveTransform>
```

### `<cvPolarToCart>`

```tsx
<cvPolarToCart>
  <cvImage src="image.jpg" />
</cvPolarToCart>
```

| Prop | Type | Required |
|---|---|---|
| `angleInDegrees` | `boolean` |  |

### `<cvPow>`

```tsx
<cvPow power={0}>
  <cvImage src="image.jpg" />
</cvPow>
```

| Prop | Type | Required |
|---|---|---|
| `power` | `number` | yes |

### `<cvReduce>`

```tsx
<cvReduce dim={0} rtype={0}>
  <cvImage src="image.jpg" />
</cvReduce>
```

| Prop | Type | Required |
|---|---|---|
| `dim` | `number` | yes |
| `rtype` | `number` | yes |
| `dtype` | `number` |  |

### `<cvRepeat>`

```tsx
<cvRepeat ny={0} nx={0}>
  <cvImage src="image.jpg" />
</cvRepeat>
```

| Prop | Type | Required |
|---|---|---|
| `ny` | `number` | yes |
| `nx` | `number` | yes |

### `<cvSetIdentity>`

```tsx
<cvSetIdentity>
  <cvImage src="image.jpg" />
</cvSetIdentity>
```

| Prop | Type | Required |
|---|---|---|
| `s` | `[v0, v1?, v2?, v3?]` |  |

### `<cvSolve>`

```tsx
<cvSolve>
  <cvImage src="image.jpg" />
</cvSolve>
```

| Prop | Type | Required |
|---|---|---|
| `flags` | `number` |  |

### `<cvSplit>`

```tsx
<cvSplit>
  <cvImage src="image.jpg" />
</cvSplit>
```

| Prop | Type | Required |
|---|---|---|
| `mv` | `Sequence` |  |

### `<cvSqrt>`

```tsx
<cvSqrt>
  <cvImage src="image.jpg" />
</cvSqrt>
```

### `<cvTrace>`

```tsx
<cvTrace>
  <cvImage src="image.jpg" />
</cvTrace>
```

### `<cvTransform>`

```tsx
<cvTransform>
  <cvImage src="image.jpg" />
</cvTransform>
```

### `<cvTranspose>`

```tsx
<cvTranspose>
  <cvImage src="image.jpg" />
</cvTranspose>
```

### `<cvVconcat>`

```tsx
<cvVconcat src={0}>
  <cvImage src="image.jpg" />
</cvVconcat>
```

| Prop | Type | Required |
|---|---|---|
| `src` | `Sequence` | yes |
