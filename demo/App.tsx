import { useState, useRef, useMemo } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Paper,
  Slider,
  IconButton,
  Switch,
  Chip,
  CircularProgress,
  Alert,
  Drawer,
} from "@mui/material";
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  Close,
  Add,
  UploadFile,
} from "@mui/icons-material";
import { OpenCVProvider, useOpenCV } from "../src/components/OpenCVProvider";
import { PipelineOutput } from "../src/components/PipelineOutput";
import { FILTERS } from "./filters";
import type { PipelineItem } from "../src/types";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#7c5bf5" },
    background: { default: "#0a0a0f", paper: "#13131f" },
  },
  typography: {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: 12,
  },
});

const SIDEBAR_WIDTH = 360;
const DEMO_IMAGE = "https://picsum.photos/seed/opencv-demo/600/400";

function App() {
  const { loading, error } = useOpenCV();
  const [imageSrc, setImageSrc] = useState(DEMO_IMAGE);
  const [pipeline, setPipeline] = useState<PipelineItem[]>([
    { id: 1, name: "Grayscale", enabled: true, props: {} },
    { id: 2, name: "GaussianBlur", enabled: true, props: { ksize: 5 } },
  ]);
  const nextId = useRef(3);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target!.result as string);
    reader.readAsDataURL(file);
  };

  const toggleFilter = (id: number) => {
    setPipeline((p) => p.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)));
  };

  const removeFilter = (id: number) => {
    setPipeline((p) => p.filter((f) => f.id !== id));
  };

  const addFilter = (name: string) => {
    const def = FILTERS[name];
    const props: Record<string, number> = {};
    Object.entries(def.params).forEach(([k, v]) => { props[k] = v.default; });
    setPipeline((p) => [...p, { id: nextId.current++, name, enabled: true, props }]);
  };

  const updateProp = (id: number, key: string, value: number) => {
    setPipeline((p) =>
      p.map((f) => (f.id === id ? { ...f, props: { ...f.props, [key]: value } } : f))
    );
  };

  const moveFilter = (idx: number, dir: -1 | 1) => {
    setPipeline((p) => {
      const next = [...p];
      const targetIdx = idx + dir;
      if (targetIdx < 0 || targetIdx >= next.length) return p;
      [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
      return next;
    });
  };

  const enabledFilters = pipeline.filter((f) => f.enabled);
  const jsxPreview = useMemo(() => {
    if (enabledFilters.length === 0) return "  <CVImage src={...} />";
    const lines: string[] = [];
    enabledFilters.forEach((f, i) => {
      const propsStr = Object.entries(f.props).map(([k, v]) => `${k}={${v}}`).join(" ");
      const indent = "  ".repeat(i + 1);
      lines.push(`${indent}<${f.name}${propsStr ? " " + propsStr : ""}>`);
    });
    lines.push("  ".repeat(enabledFilters.length + 1) + "<CVImage src={...} />");
    for (let i = enabledFilters.length - 1; i >= 0; i--) {
      lines.push("  ".repeat(i + 1) + `</${enabledFilters[i].name}>`);
    }
    return lines.join("\n");
  }, [enabledFilters]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", bgcolor: "background.default", flexDirection: "column", gap: 2 }}>
        <CircularProgress color="primary" />
        <Typography variant="caption" sx={{ letterSpacing: 3, textTransform: "uppercase" }}>Loading OpenCV.js</Typography>
        <Typography variant="caption" color="text.secondary">~8MB WASM module</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", bgcolor: "background.default" }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar variant="dense" sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: 1, color: "primary.main" }}>cv::compose</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 2, textTransform: "uppercase" }}>react + opencv.js</Typography>
          </Box>
          <Button variant="contained" size="small" component="label" startIcon={<UploadFile />}>
            Upload Image
            <input type="file" accept="image/*" onChange={handleFile} hidden />
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Drawer
          variant="permanent"
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: SIDEBAR_WIDTH,
              position: "relative",
              bgcolor: "background.default",
              borderRight: 1,
              borderColor: "divider",
              p: 2,
              overflow: "auto",
            },
          }}
        >
          <Typography variant="overline" color="text.secondary" sx={{ mb: 1.5 }}>Pipeline</Typography>

          {pipeline.map((f, idx) => (
            <Paper
              key={f.id}
              variant="outlined"
              sx={{
                p: 1.5,
                mb: 1,
                opacity: f.enabled ? 1 : 0.4,
                transition: "opacity 0.2s",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: f.enabled && Object.keys(f.props).length ? 1.5 : 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <IconButton size="small" disabled={idx === 0} onClick={() => moveFilter(idx, -1)} sx={{ p: 0 }}>
                      <KeyboardArrowUp fontSize="small" />
                    </IconButton>
                    <IconButton size="small" disabled={idx === pipeline.length - 1} onClick={() => moveFilter(idx, 1)} sx={{ p: 0 }}>
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
                    onChange={() => toggleFilter(f.id)}
                  />
                  <IconButton size="small" onClick={() => removeFilter(f.id)} sx={{ color: "text.secondary" }}>
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {f.enabled && Object.entries(FILTERS[f.name]?.params || {}).map(([key, cfg]) => (
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
                    value={f.props[key]}
                    onChange={(_e, val) => updateProp(f.id, key, val as number)}
                  />
                </Box>
              ))}
            </Paper>
          ))}

          <Typography variant="overline" color="text.secondary" sx={{ mt: 2, mb: 1, display: "block" }}>Add Filter</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {Object.keys(FILTERS).map((name) => (
              <Chip
                key={name}
                label={name}
                size="small"
                icon={<Add />}
                variant="outlined"
                onClick={() => addFilter(name)}
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Box>

          <Typography variant="overline" color="text.secondary" sx={{ mt: 3, mb: 1, display: "block" }}>JSX Output</Typography>
          <Paper variant="outlined" sx={{ p: 1.5 }}>
            <pre style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: "#9090b8", overflow: "auto", whiteSpace: "pre" }}>
              {jsxPreview}
            </pre>
          </Paper>
        </Drawer>

        <Box sx={{ flex: 1, overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
          <PipelineOutput imageSrc={imageSrc} pipeline={pipeline} filters={FILTERS} />
        </Box>
      </Box>
    </Box>
  );
}

export default function Root() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <OpenCVProvider>
        <App />
      </OpenCVProvider>
    </ThemeProvider>
  );
}
