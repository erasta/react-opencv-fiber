import {
  Typography,
  Box,
  Paper,
  Slider,
  IconButton,
  Switch,
  Chip,
  Autocomplete,
  TextField,
} from "@mui/material";
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  Close,
} from "@mui/icons-material";
import { FILTERS, getOpParams, OP_NAMES } from "./filters";
import type { PipelineItem } from "../src/types";

export function FilterCard({
  item,
  index,
  totalCount,
  onToggle,
  onRemove,
  onMove,
  onUpdateProp,
  onReplaceProps,
}: {
  item: PipelineItem;
  index: number;
  totalCount: number;
  onToggle: () => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
  onUpdateProp: (key: string, value: number | string) => void;
  onReplaceProps: (props: Record<string, number | string>) => void;
}) {
  const f = item;
  const hasParams = f.enabled && (
    f.name === "CVOp" || Object.keys(FILTERS[f.name]?.params || {}).length > 0
  );

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        mb: 1,
        opacity: f.enabled ? 1 : 0.4,
        transition: "opacity 0.2s",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: hasParams ? 1.5 : 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <IconButton size="small" disabled={index === 0} onClick={() => onMove(-1)} sx={{ p: 0 }}>
              <KeyboardArrowUp fontSize="small" />
            </IconButton>
            <IconButton size="small" disabled={index === totalCount - 1} onClick={() => onMove(1)} sx={{ p: 0 }}>
              <KeyboardArrowDown fontSize="small" />
            </IconButton>
          </Box>
          <Chip
            label={`<${f.name}>`}
            size="small"
            color={f.enabled ? "primary" : "default"}
            variant={f.enabled ? "filled" : "outlined"}
            sx={{ fontFamily: "inherit", fontWeight: 500 }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Switch
            size="small"
            checked={f.enabled}
            onChange={onToggle}
          />
          <IconButton size="small" onClick={onRemove} sx={{ color: "text.secondary" }}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {f.enabled && f.name !== "CVOp" && Object.entries(FILTERS[f.name]?.params || {}).map(([key, cfg]) => (
        <Box key={key} sx={{ px: 1, mb: 0.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: -0.5 }}>
            <Typography variant="caption" color="text.secondary">{key}</Typography>
            <Typography variant="caption" color="primary">{f.props[key]}</Typography>
          </Box>
          <Slider
            size="small"
            min={cfg.min}
            max={cfg.max}
            step={cfg.step}
            value={f.props[key] as number}
            onChange={(_e, val) => onUpdateProp(key, val as number)}
          />
        </Box>
      ))}

      {f.enabled && f.name === "CVOp" && (
        <Box sx={{ px: 1 }}>
          <Autocomplete
            size="small"
            options={OP_NAMES}
            value={(f.props.op as string) || null}
            onChange={(_e, val) => {
              const newOp = val ?? "";
              const newProps: Record<string, number | string> = { op: newOp };
              if (newOp) {
                for (const p of getOpParams(newOp)) {
                  if (p.isNumeric) {
                    newProps[p.name] = 0;
                  }
                }
              }
              onReplaceProps(newProps);
            }}
            slotProps={{ listbox: { style: { maxHeight: "50vh" } } }}
            renderInput={(params) => (
              <TextField {...params} label="OpenCV function" variant="outlined" />
            )}
            sx={{ mb: 1 }}
          />
          {f.props.op && getOpParams(f.props.op as string).map((p) =>
            p.isNumeric ? (
              <Box key={p.name} sx={{ mb: 0.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: -0.5 }}>
                  <Typography variant="caption" color="text.secondary">{p.name}</Typography>
                  <Typography variant="caption" color="primary">{f.props[p.name] as number ?? 0}</Typography>
                </Box>
                <Slider
                  size="small"
                  min={0}
                  max={p.type === "double" ? 10 : 255}
                  step={p.type === "double" ? 0.1 : 1}
                  value={(f.props[p.name] as number) ?? 0}
                  onChange={(_e, val) => onUpdateProp(p.name, val as number)}
                />
              </Box>
            ) : (
              <Typography key={p.name} variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                {p.name}: {p.type} (default)
              </Typography>
            )
          )}
        </Box>
      )}
    </Paper>
  );
}
