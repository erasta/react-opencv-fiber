# Histograms

### `<cvCalcBackProject>`

```tsx
<cvCalcBackProject images={0} channels={0} ranges={0} scale={0}>
  <cvImage src="image.jpg" />
</cvCalcBackProject>
```

| Prop | Type | Required |
|---|---|---|
| `images` | `Sequence` | yes |
| `channels` | `Sequence` | yes |
| `ranges` | `Sequence` | yes |
| `scale` | `number` | yes |

### `<cvCalcHist>`

```tsx
<cvCalcHist images={0} channels={0} histSize={0} ranges={0}>
  <cvImage src="image.jpg" />
</cvCalcHist>
```

| Prop | Type | Required |
|---|---|---|
| `images` | `Sequence` | yes |
| `channels` | `Sequence` | yes |
| `histSize` | `Sequence` | yes |
| `ranges` | `Sequence` | yes |
| `accumulate` | `boolean` |  |

### `<cvCompareHist>`

```tsx
<cvCompareHist method={0}>
  <cvImage src="image.jpg" />
</cvCompareHist>
```

| Prop | Type | Required |
|---|---|---|
| `method` | `number` | yes |

### `<cvEqualizeHist>`

```tsx
<cvEqualizeHist>
  <cvImage src="image.jpg" />
</cvEqualizeHist>
```
