# Thresholding

### `<cvAdaptiveThreshold>`

```tsx
<cvAdaptiveThreshold maxValue={0} adaptiveMethod={0} thresholdType={0} blockSize={0} C={0}>
  <cvImage src="image.jpg" />
</cvAdaptiveThreshold>
```

| Prop | Type | Required |
|---|---|---|
| `maxValue` | `number` | yes |
| `adaptiveMethod` | `number` | yes |
| `thresholdType` | `number` | yes |
| `blockSize` | `number` | yes |
| `C` | `number` | yes |

### `<cvThreshold>`

```tsx
<cvThreshold thresh={0} maxval={0} type={0}>
  <cvImage src="image.jpg" />
</cvThreshold>
```

| Prop | Type | Required |
|---|---|---|
| `thresh` | `number` | yes |
| `maxval` | `number` | yes |
| `type` | `number` | yes |
