const path = require('path');
const fs = require('fs');
const root = path.resolve(__dirname, '..');

const sigs = require(path.join(root, 'src/data/opencv-signatures.json'));
const available = require(path.join(__dirname, 'opencv-available-ops.json'));
const availableSet = new Set(available);

const cats = {
  'image-filtering': {
    title: 'Image Filtering',
    ops: ['bilateralFilter','blur','boxFilter','dilate','erode','filter2D','GaussianBlur','Laplacian','medianBlur','morphologyEx','pyrDown','pyrUp','Scharr','sepFilter2D','Sobel'],
  },
  'color': {
    title: 'Color & Conversion',
    ops: ['cvtColor','demosaicing'],
  },
  'thresholding': {
    title: 'Thresholding',
    ops: ['adaptiveThreshold','threshold'],
  },
  'edge-detection': {
    title: 'Edge & Feature Detection',
    ops: ['Canny','cornerHarris','cornerMinEigenVal','goodFeaturesToTrack','HoughCircles','HoughLines','HoughLinesP'],
  },
  'histograms': {
    title: 'Histograms',
    ops: ['calcBackProject','calcHist','compareHist','equalizeHist'],
  },
  'drawing': {
    title: 'Drawing',
    ops: ['circle','drawContours','ellipse','ellipse2Poly','fillConvexPoly','fillPoly','line','polylines','putText','rectangle'],
  },
  'geometric-transforms': {
    title: 'Geometric Transforms',
    ops: ['flip','getAffineTransform','getPerspectiveTransform','getRotationMatrix2D','remap','resize','rotate','warpAffine','warpPerspective','warpPolar'],
  },
  'contours': {
    title: 'Contours',
    ops: ['approxPolyDP','arcLength','boundingRect','connectedComponents','connectedComponentsWithStats','contourArea','convexHull','convexityDefects','findContours','fitEllipse','fitLine','isContourConvex','matchShapes','minAreaRect','minEnclosingCircle','moments','pointPolygonTest'],
  },
  'arithmetic': {
    title: 'Arithmetic & Logic',
    ops: ['absdiff','add','addWeighted','bitwise_and','bitwise_not','bitwise_or','bitwise_xor','compare','convertScaleAbs','divide','max','min','multiply','subtract'],
  },
  'core-math': {
    title: 'Core / Math',
    ops: ['cartToPolar','countNonZero','dft','determinant','eigen','exp','gemm','getOptimalDFTSize','hconcat','inRange','invert','kmeans','log','magnitude','mean','meanStdDev','merge','minMaxLoc','mixChannels','norm','normalize','perspectiveTransform','polarToCart','pow','reduce','repeat','setIdentity','solve','split','sqrt','trace','transform','transpose','vconcat'],
  },
  'photo': {
    title: 'Photo',
    ops: ['inpaint'],
  },
  'video': {
    title: 'Optical Flow & Video',
    ops: ['CamShift','calcOpticalFlowFarneback','calcOpticalFlowPyrLK','meanShift'],
  },
  'template-matching': {
    title: 'Template Matching',
    ops: ['matchTemplate'],
  },
  'calibration': {
    title: 'Calibration & 3D',
    ops: ['calibrateCameraExtended','drawFrameAxes','estimateAffine2D','findHomography','findTransformECC','getDefaultNewCameraMatrix','initUndistortRectifyMap','projectPoints','Rodrigues','solvePnP','solvePnPRansac','solvePnPRefineLM','undistort'],
  },
  'segmentation': {
    title: 'Segmentation',
    ops: ['distanceTransform','distanceTransformWithLabels','floodFill','grabCut','watershed'],
  },
  'feature-matching': {
    title: 'Feature Matching',
    ops: ['drawKeypoints','drawMatches','drawMatchesKnn'],
  },
  'misc': {
    title: 'Misc',
    ops: ['copyMakeBorder','getBuildInformation','getStructuringElement','groupRectangles','integral','integral2','LUT','randn','randu','setRNGSeed','solvePoly'],
  },
};

const IO_TYPES = new Set(['InputArray', 'OutputArray', 'InputOutputArray']);

function jsxName(op) {
  // cvtColor -> cvCvtColor, GaussianBlur -> cvGaussianBlur, bitwise_and -> cv_bitwise_and
  if (op.includes('_')) return 'cv_' + op;
  return 'cv' + op.charAt(0).toUpperCase() + op.slice(1);
}

function typeStr(t) {
  if (!t) return 'number';
  if (t === 'double' || t === 'float') return 'number';
  if (t === 'int') return 'number';
  if (t === 'bool') return 'boolean';
  if (t === 'Size') return '[w, h]';
  if (t === 'Point') return '[x, y]';
  if (t === 'Scalar') return '[v0, v1?, v2?, v3?]';
  if (t === 'string' || t === 'String') return 'string';
  if (IO_TYPES.has(t)) return null; // skip src/dst
  return t;
}

function genOpDoc(op) {
  const sig = sigs[op];
  if (!sig) return null;

  const overload = sig.overloads[0]; // use first overload
  const jsx = jsxName(op);

  // Filter out src/dst params
  const props = overload.params.filter(p => !IO_TYPES.has(p.type));
  const required = props.filter(p => p.required);
  const optional = props.filter(p => !p.required);

  // Build example
  const exampleProps = required.map(p => {
    const t = typeStr(p.type);
    if (t === '[w, h]') return `${p.name}={[5, 5]}`;
    if (t === '[x, y]') return `${p.name}={[0, 0]}`;
    if (t === '[v0, v1?, v2?, v3?]') return `${p.name}={[255, 0, 0]}`;
    if (t === 'boolean') return `${p.name}={false}`;
    if (t === 'string') return `${p.name}="value"`;
    return `${p.name}={0}`;
  }).join(' ');

  let lines = [];
  lines.push(`### \`<${jsx}>\``);
  lines.push('');
  lines.push('```tsx');
  if (exampleProps) {
    lines.push(`<${jsx} ${exampleProps}>`);
  } else {
    lines.push(`<${jsx}>`);
  }
  lines.push('  <cvImage src="image.jpg" />');
  lines.push(`</${jsx}>`);
  lines.push('```');
  lines.push('');

  if (props.length > 0) {
    lines.push('| Prop | Type | Required |');
    lines.push('|---|---|---|');
    for (const p of props) {
      const t = typeStr(p.type) || p.type;
      lines.push(`| \`${p.name}\` | \`${t}\` | ${p.required ? 'yes' : '' } |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

// Generate docs
const docsDir = path.join(root, 'docs');
fs.mkdirSync(docsDir, { recursive: true });

for (const [slug, cat] of Object.entries(cats)) {
  const ops = cat.ops.filter(op => availableSet.has(op));
  if (ops.length === 0) continue;

  let lines = [];
  lines.push(`# ${cat.title}`);
  lines.push('');

  for (const op of ops) {
    const doc = genOpDoc(op);
    if (doc) lines.push(doc);
  }

  const file = path.join(docsDir, `${slug}.md`);
  fs.writeFileSync(file, lines.join('\n'));
  console.log(`Wrote ${file} (${ops.length} ops)`);
}

// Generate index
let index = [];
index.push('# API Reference');
index.push('');
index.push('## Components');
index.push('');
index.push('- [Components](components.md) — `<OpenCvProvider>`, `useOpenCv()`, `<CvCanvas>`, `<cvImage>`, `<cvMat>`, `__srcParam`/`__dstParam`');
index.push('');
index.push('## CV Operations');
index.push('');
index.push('Per-operation reference with props and usage examples.');
index.push('');
for (const [slug, cat] of Object.entries(cats)) {
  const ops = cat.ops.filter(op => availableSet.has(op));
  if (ops.length === 0) continue;
  index.push(`- [${cat.title}](${slug}.md) — ${ops.map(o => '`' + o + '`').join(', ')}`);
}
index.push('');
const indexFile = path.join(docsDir, 'README.md');
fs.writeFileSync(indexFile, index.join('\n'));
console.log(`Wrote ${indexFile}`);
