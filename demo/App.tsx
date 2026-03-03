import { useState } from "react";
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
  CircularProgress,
  Alert,
  Drawer,
} from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { OpenCVProvider, useOpenCV, CvCanvas } from "react-opencv-fiber";

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

  const [blurKsize, setBlurKsize] = useState(5);
  const [cannyT1, setCannyT1] = useState(16);
  const [cannyT2, setCannyT2] = useState(31);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target!.result as string);
    reader.readAsDataURL(file);
  };

  const k = Math.max(1, blurKsize % 2 === 0 ? blurKsize + 1 : blurKsize);

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

          <Paper variant="outlined" sx={{ p: 1.5, mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1.5 }}>GaussianBlur</Typography>
            <Box sx={{ px: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: -0.5 }}>
                <Typography variant="caption" color="text.secondary">ksize</Typography>
                <Typography variant="caption" color="primary">{k}</Typography>
              </Box>
              <Slider size="small" min={1} max={31} step={2} value={blurKsize} onChange={(_e, val) => setBlurKsize(val as number)} />
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ p: 1.5, mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>Grayscale</Typography>
          </Paper>

          <Paper variant="outlined" sx={{ p: 1.5, mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1.5 }}>Canny</Typography>
            <Box sx={{ px: 1, mb: 0.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: -0.5 }}>
                <Typography variant="caption" color="text.secondary">threshold1</Typography>
                <Typography variant="caption" color="primary">{cannyT1}</Typography>
              </Box>
              <Slider size="small" min={0} max={255} step={1} value={cannyT1} onChange={(_e, val) => setCannyT1(val as number)} />
            </Box>
            <Box sx={{ px: 1, mb: 0.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: -0.5 }}>
                <Typography variant="caption" color="text.secondary">threshold2</Typography>
                <Typography variant="caption" color="primary">{cannyT2}</Typography>
              </Box>
              <Slider size="small" min={0} max={255} step={1} value={cannyT2} onChange={(_e, val) => setCannyT2(val as number)} />
            </Box>
          </Paper>

          <Typography variant="overline" color="text.secondary" sx={{ mt: 3, mb: 1, display: "block" }}>JSX Output</Typography>
          <Paper variant="outlined" sx={{ p: 1.5 }}>
            <pre style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: "#9090b8", overflow: "auto", whiteSpace: "pre" }}>
{`  <cvCanny threshold1={${cannyT1}} threshold2={${cannyT2}}>
    <cvCvtColor code={11}>
      <cvGaussianBlur ksize={[${k},${k}]} sigmaX={0}>
        <cvImage src={...} />
      </cvGaussianBlur>
    </cvCvtColor>
  </cvCanny>`}
            </pre>
          </Paper>
        </Drawer>

        <Box sx={{ flex: 1, overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
          <CvCanvas style={{ maxWidth: "100%" }}>
            <cvCanny threshold1={cannyT1} threshold2={cannyT2}>
              <cvCvtColor code={11}>
                <cvGaussianBlur ksize={[k, k]} sigmaX={0}>
                  <cvImage src={imageSrc} />
                </cvGaussianBlur>
              </cvCvtColor>
            </cvCanny>
          </CvCanvas>
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
