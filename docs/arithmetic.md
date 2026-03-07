# Arithmetic & Logic

### `<cvAbsdiff>`

```tsx
<cvAbsdiff>
  <cvImage src="image.jpg" />
</cvAbsdiff>
```

### `<cvAdd>`

```tsx
<cvAdd>
  <cvImage src="image.jpg" />
</cvAdd>
```

| Prop | Type | Required |
|---|---|---|
| `dtype` | `number` |  |

### `<cvAddWeighted>`

```tsx
<cvAddWeighted alpha={0} beta={0} gamma={0}>
  <cvImage src="image.jpg" />
</cvAddWeighted>
```

| Prop | Type | Required |
|---|---|---|
| `alpha` | `number` | yes |
| `beta` | `number` | yes |
| `gamma` | `number` | yes |
| `dtype` | `number` |  |

### `<cv_bitwise_and>`

```tsx
<cv_bitwise_and>
  <cvImage src="image.jpg" />
</cv_bitwise_and>
```

### `<cv_bitwise_not>`

```tsx
<cv_bitwise_not>
  <cvImage src="image.jpg" />
</cv_bitwise_not>
```

### `<cv_bitwise_or>`

```tsx
<cv_bitwise_or>
  <cvImage src="image.jpg" />
</cv_bitwise_or>
```

### `<cv_bitwise_xor>`

```tsx
<cv_bitwise_xor>
  <cvImage src="image.jpg" />
</cv_bitwise_xor>
```

### `<cvCompare>`

```tsx
<cvCompare cmpop={0}>
  <cvImage src="image.jpg" />
</cvCompare>
```

| Prop | Type | Required |
|---|---|---|
| `cmpop` | `number` | yes |

### `<cvConvertScaleAbs>`

```tsx
<cvConvertScaleAbs>
  <cvImage src="image.jpg" />
</cvConvertScaleAbs>
```

| Prop | Type | Required |
|---|---|---|
| `alpha` | `number` |  |
| `beta` | `number` |  |

### `<cvDivide>`

```tsx
<cvDivide>
  <cvImage src="image.jpg" />
</cvDivide>
```

| Prop | Type | Required |
|---|---|---|
| `scale` | `number` |  |
| `dtype` | `number` |  |

### `<cvMax>`

```tsx
<cvMax>
  <cvImage src="image.jpg" />
</cvMax>
```

### `<cvMin>`

```tsx
<cvMin>
  <cvImage src="image.jpg" />
</cvMin>
```

### `<cvMultiply>`

```tsx
<cvMultiply>
  <cvImage src="image.jpg" />
</cvMultiply>
```

| Prop | Type | Required |
|---|---|---|
| `scale` | `number` |  |
| `dtype` | `number` |  |

### `<cvSubtract>`

```tsx
<cvSubtract>
  <cvImage src="image.jpg" />
</cvSubtract>
```

| Prop | Type | Required |
|---|---|---|
| `dtype` | `number` |  |
