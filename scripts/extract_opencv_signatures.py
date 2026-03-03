"""
Extract OpenCV function signatures from cv2 docstrings.

Parses the structured docstrings that OpenCV's Python bindings expose
and outputs a JSON metadata file with parameter names, types, and
which are optional.

Docstring format examples:
  GaussianBlur(src, ksize, sigmaX[, dst[, sigmaY[, borderType]]]) -> dst
  cvtColor(src, code[, dst[, dstCn]]) -> dst
  Canny(image, threshold1, threshold2[, edges[, apertureSize[, L2gradient]]]) -> edges

Type extraction strategy (in priority order):
  1. Parse cv2's bundled .pyi stub file using ast — these have accurate C++ types.
  2. Fall back to improved name- and description-based heuristics when the stub
     doesn't cover a function.
"""

import ast
import cv2
import json
import re
import sys
import inspect
from pathlib import Path


def parse_signature(docstring: str) -> list[dict] | None:
    """Parse an OpenCV docstring into a list of overload signatures."""
    if not docstring:
        return None

    # Each line that matches the pattern is an overload
    pattern = re.compile(
        r"^(\w+)\(([^)]*)\)\s*->\s*(.+)$", re.MULTILINE
    )
    matches = pattern.findall(docstring)
    if not matches:
        return None

    overloads = []
    for name, params_str, returns in matches:
        params = parse_params(params_str)
        overloads.append({
            "name": name,
            "params": params,
            "returns": returns.strip(),
        })

    return overloads


def parse_params(params_str: str) -> list[dict]:
    """Parse a parameter string like 'src, ksize, sigmaX[, dst[, sigmaY]]'"""
    params = []
    # Remove nested brackets by tracking depth
    # We want to extract each param and whether it's optional
    depth = 0
    current = ""
    for char in params_str:
        if char == "[":
            depth += 1
        elif char == "]":
            depth -= 1
        elif char == "," and depth >= 0:
            param = current.strip().lstrip("[").strip()
            if param:
                # It's optional if we had to strip a bracket or we're inside brackets
                params.append(param)
            current = ""
            continue
        if char not in "[]":
            current += char
    # Last param
    param = current.strip().lstrip("[").strip()
    if param:
        params.append(param)

    # Now determine which are optional by re-examining the original string
    result = []
    # Find position of first '[' to determine optional boundary
    first_bracket = params_str.find("[")
    if first_bracket == -1:
        # All required
        for p in params:
            result.append({"name": p, "required": True})
    else:
        # Count required params (those before the first '[')
        required_part = params_str[:first_bracket]
        required_count = len([x for x in required_part.split(",") if x.strip()])
        for i, p in enumerate(params):
            result.append({"name": p, "required": i < required_count})

    return result


def _normalize_stub_type(annotation: ast.expr | None) -> str | None:
    """Convert an ast annotation node from the .pyi stub to an OpenCV type string.

    Handles forms seen in cv2/__init__.pyi, e.g.:
      cv2.typing.MatLike          -> InputArray   (refined to OutputArray by caller)
      UMat                        -> InputArray   (same treatment as MatLike)
      cv2.typing.Size             -> Size
      cv2.typing.Point            -> Point
      cv2.typing.Scalar           -> Scalar
      cv2.typing.Rect             -> Rect
      cv2.typing.RotatedRect      -> RotatedRect
      cv2.typing.TermCriteria     -> TermCriteria
      float                       -> double
      int                         -> int
      bool                        -> bool
      str                         -> str
      X | None  (Optional)        -> delegates to inner type
      tuple[...]                  -> tuple
    """
    if annotation is None:
        return None

    # X | None  (Python 3.10+ union used in stubs)
    if isinstance(annotation, ast.BinOp) and isinstance(annotation.op, ast.BitOr):
        # Recurse on the non-None side
        if isinstance(annotation.right, ast.Constant) and annotation.right.value is None:
            return _normalize_stub_type(annotation.left)
        if isinstance(annotation.left, ast.Constant) and annotation.left.value is None:
            return _normalize_stub_type(annotation.right)

    # Simple name: float, int, bool, str, UMat
    if isinstance(annotation, ast.Name):
        name = annotation.id
        if name == "float":
            return "double"
        if name == "int":
            return "int"
        if name == "bool":
            return "bool"
        if name == "str":
            return "str"
        if name == "UMat":
            return "InputArray"   # UMat overloads treated same as MatLike
        return name

    # Attribute access: cv2.typing.MatLike, cv2.typing.Size, etc.
    if isinstance(annotation, ast.Attribute):
        attr = annotation.attr
        _CV2_TYPING_MAP: dict[str, str] = {
            "MatLike": "InputArray",
            "Size": "Size",
            "Size2f": "Size2f",
            "Point": "Point",
            "Point2f": "Point2f",
            "Point2d": "Point2d",
            "Point3i": "Point3i",
            "Point3f": "Point3f",
            "Point3d": "Point3d",
            "Scalar": "Scalar",
            "Rect": "Rect",
            "Rect2i": "Rect",
            "Rect2f": "Rect2f",
            "Rect2d": "Rect2d",
            "RotatedRect": "RotatedRect",
            "TermCriteria": "TermCriteria",
            "Range": "Range",
            "MatShape": "MatShape",
            "Vec2i": "Vec2i",
            "Vec2f": "Vec2f",
            "Vec2d": "Vec2d",
            "Vec3i": "Vec3i",
            "Vec3f": "Vec3f",
            "Vec3d": "Vec3d",
            "Vec4i": "Vec4i",
            "Vec4f": "Vec4f",
            "Vec4d": "Vec4d",
            "Vec6f": "Vec6f",
            "Matx33f": "Matx33f",
            "Matx33d": "Matx33d",
            "Matx44f": "Matx44f",
            "Matx44d": "Matx44d",
        }
        if attr in _CV2_TYPING_MAP:
            return _CV2_TYPING_MAP[attr]
        return attr

    # Subscript: tuple[...], typing.Optional[...], list[...], etc.
    if isinstance(annotation, ast.Subscript):
        outer = _normalize_stub_type(annotation.value)
        if outer == "tuple":
            return "tuple"
        if outer in ("Optional", "Union"):
            # typing.Optional[X] / typing.Union[X, None]
            slice_node = annotation.slice
            if isinstance(slice_node, ast.Tuple):
                # Union[X, Y, ...] — pick first non-None
                for elt in slice_node.elts:
                    if not (isinstance(elt, ast.Constant) and elt.value is None):
                        return _normalize_stub_type(elt)
            return _normalize_stub_type(slice_node)
        return outer

    # Constant (e.g. None as default)
    if isinstance(annotation, ast.Constant):
        if annotation.value is None:
            return None

    return None


# Output-side parameter names that indicate the parameter receives written data.
_OUTPUT_PARAM_NAMES = frozenset({
    "dst", "output", "out", "result", "edges", "labels", "map1", "map2",
    "hist", "backProject", "lines", "circles", "contours", "hierarchy",
    "keypoints", "descriptors", "disparity", "flow", "eigenvalues",
    "eigenvectors", "idx", "dstmap1", "dstmap2",
})


def _load_stub_types() -> dict[str, dict[str, str]]:
    """Parse the cv2 .pyi stub file and return {func_name: {param_name: type_str}}.

    Only considers the first @overload that uses cv2.typing.MatLike (not UMat),
    or the first overload if no MatLike variant exists.  Returns an empty dict
    if the stub file cannot be located or parsed.
    """
    # Locate the stub next to the compiled extension.
    spec = getattr(cv2, "__spec__", None)
    if spec is None or spec.origin is None:
        return {}

    stub_path = Path(spec.origin).with_suffix(".pyi")
    if not stub_path.exists():
        # Some installations put the stub as __init__.pyi inside a package dir.
        stub_path = Path(spec.origin).parent / "__init__.pyi"
    if not stub_path.exists():
        return {}

    try:
        tree = ast.parse(stub_path.read_text(encoding="utf-8"))
    except (SyntaxError, OSError):
        return {}

    # Collect all top-level function defs grouped by name.
    # Each entry is a list of ast.FunctionDef nodes (overloads).
    from collections import defaultdict
    func_nodes: dict[str, list[ast.FunctionDef]] = defaultdict(list)

    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            # Only top-level defs (their parent is the Module)
            func_nodes[node.name].append(node)

    result: dict[str, dict[str, str]] = {}

    for func_name, overloads in func_nodes.items():
        # Prefer an overload that uses cv2.typing.MatLike (i.e. the "normal"
        # numpy-array variant) over one that uses UMat.
        preferred = None
        for ov in overloads:
            src = ast.unparse(ov) if hasattr(ast, "unparse") else ""
            if "cv2.typing.MatLike" in src or "MatLike" in src:
                preferred = ov
                break
        if preferred is None:
            preferred = overloads[0]

        param_types: dict[str, str] = {}
        args = preferred.args
        all_args = args.posonlyargs + args.args + args.kwonlyargs

        # Build annotation list; posonlyargs + args share positional annotations.
        for arg in all_args:
            if arg.annotation is None:
                continue
            pname = arg.arg
            ptype = _normalize_stub_type(arg.annotation)
            if ptype is None:
                continue

            # Refine InputArray to OutputArray for known output param names.
            if ptype == "InputArray" and pname in _OUTPUT_PARAM_NAMES:
                ptype = "OutputArray"

            param_types[pname] = ptype

        if param_types:
            result[func_name] = param_types

    return result


# Module-level cache so we parse the stub only once.
_STUB_TYPES: dict[str, dict[str, str]] | None = None


def _get_stub_types() -> dict[str, dict[str, str]]:
    global _STUB_TYPES
    if _STUB_TYPES is None:
        _STUB_TYPES = _load_stub_types()
    return _STUB_TYPES


def get_param_types_from_doc(func_name: str, docstring: str) -> dict[str, str]:
    """Return a mapping of {param_name: type_str} for *func_name*.

    Resolution order:
      1. cv2 .pyi stub file (accurate C++-derived types) — covers the vast
         majority of public functions in OpenCV 4.x.
      2. Improved heuristics derived from parameter *names* (high confidence) —
         exploits OpenCV's strong naming conventions (src/dst → Mat, ksize →
         Size, sigmaX → double, code/borderType → int, etc.).
      3. Heuristics derived from @param description text (lower confidence) —
         restricted to highly specific anchored phrases to avoid false positives
         such as the original sigmaY→Size or code→Scalar misclassifications.
    """
    # --- 1. Stub-based types (most accurate) ---
    stub = _get_stub_types()
    if func_name in stub:
        return dict(stub[func_name])

    # --- 2 & 3. Heuristic fallback ---
    types: dict[str, str] = {}
    if not docstring:
        return types

    # 2a. Parameter-name heuristics (applied unconditionally, high confidence).
    #     These are based on OpenCV's strong naming conventions.
    _NAME_RULES: list[tuple[re.Pattern[str], str]] = [
        # Mat / array params
        (re.compile(r"^(src\d*|dst\d*|img\d*|image\d*|frame\d*|input\d*|output\d*"
                    r"|mask|gray|rgb|bgr|hsv|lab|ycrcb|dx|dy|dz"
                    r"|map[12]|backProject|edges|result|hist|disparity"
                    r"|flow|prob|probImage|src_gray)$"), "InputArray"),
        # Size (always a 2-tuple of ints in OpenCV Python)
        (re.compile(r"^(ksize|winSize|blockSize|patchSize|templateWindowSize"
                    r"|searchWindowSize|maxCorners)$"), "Size"),
        # Numeric scalar sigma / smoothing params → double
        (re.compile(r"^(sigma[XYZxy]?|sigmaColor|sigmaSpace|sigmaI|sigmaS"
                    r"|alpha|beta|gamma|delta|eps|rho|theta|angle|scale"
                    r"|factor|ratio|minDist|param\d*|h|hColor|hForColorComponents"
                    r"|sp|sr|pyrScale|k|C|mu|nu)$"), "double"),
        # Integer counters / flags / codes
        (re.compile(r"^(code|flags|type|method|borderType|normType|distType"
                    r"|interpolation|colormap|rtype|ddepth|dtype|mode"
                    r"|houghMethod|morphShape|thresholdType"
                    r"|connectivity|lineType|shift|dstCn|levels|nlevels"
                    r"|nOctaves|nOctaveLayers|diffusivity|neighborhood"
                    r"|numThreads|maxCount|maxLevel|iterCount"
                    r"|kNearest|k_nearest)$"), "int"),
        # Scalar thresholds / float params
        (re.compile(r"^(thresh|threshold[12]?|maxval|maxValue|lowThreshold"
                    r"|highThreshold|minVal|maxVal|dp|minDist)$"), "double"),
        # Point
        (re.compile(r"^(anchor|center|pt\d*|point\d*|offset)$"), "Point"),
        # Scalar (color / 4-channel value)
        (re.compile(r"^(color|borderValue|value|mean)$"), "Scalar"),
        # bool
        (re.compile(r"^(L2gradient|useHarrisDetector|extended|upright"
                    r"|nms_across_scales|computeOrientation)$"), "bool"),
    ]

    # Collect all param names from the signature lines (they may appear in the
    # doc before any @param block).
    sig_pattern = re.compile(r"^(\w+)\(([^)]*)\)\s*->", re.MULTILINE)
    all_param_names: set[str] = set()
    for m in sig_pattern.finditer(docstring):
        raw = m.group(2)
        # Strip bracket markers and split
        raw = raw.replace("[", "").replace("]", "")
        for part in raw.split(","):
            part = part.strip()
            if part:
                all_param_names.add(part)

    for pname in all_param_names:
        for pattern, ptype in _NAME_RULES:
            if pattern.match(pname):
                inferred = ptype
                # Refine InputArray: dst/output params are OutputArray
                if inferred == "InputArray" and pname in _OUTPUT_PARAM_NAMES:
                    inferred = "OutputArray"
                types[pname] = inferred
                break

    # 2b. @param description heuristics — only applied to params not yet typed,
    #     and with highly specific patterns to avoid false matches.
    #     Key fix: match "input image/array" and "output image/array" as whole
    #     phrases at the *start* of the description, not as stray words.
    _DESC_RULES: list[tuple[re.Pattern[str], str]] = [
        # InputArray / OutputArray — match only if the *first few words* say so
        (re.compile(r"^\s*(input|source|src)\s+(image|array|matrix|frame|mat)\b"), "InputArray"),
        (re.compile(r"^\s*(output|destination|result|dst)\s+(image|array|matrix|frame|mat)\b"), "OutputArray"),
        # Size — only if description starts with "kernel size" or "window size"
        (re.compile(r"^\s*(gaussian\s+)?kernel\s+size\b"), "Size"),
        (re.compile(r"^\s*window\s+size\b"), "Size"),
        # Specific numeric descriptions — very anchored
        (re.compile(r"^\s*(gaussian\s+)?(standard\s+deviation|sigma)\b"), "double"),
        # Integer flag/enum descriptions
        (re.compile(r"^\s*(color\s+space\s+)?conversion\s+code\b"), "int"),
        (re.compile(r"^\s*border\s+(mode|type|padding)\b"), "int"),
        (re.compile(r"^\s*interpolation\s+(flag|method|mode)\b"), "int"),
    ]

    param_block = re.compile(r"@param\s+(\w+)\s+(.+?)(?=@param|@sa|@see|@note|\Z)", re.DOTALL)
    for match in param_block.finditer(docstring):
        pname = match.group(1)
        if pname in types:
            continue  # already typed by name heuristic
        # Use only the first sentence / line of the description to avoid
        # accidentally matching unrelated words further in the text.
        first_line = match.group(2).split("\n")[0].lower()
        for pattern, ptype in _DESC_RULES:
            if pattern.search(first_line):
                if ptype == "InputArray" and pname in _OUTPUT_PARAM_NAMES:
                    ptype = "OutputArray"
                types[pname] = ptype
                break

    return types


def extract_all_signatures() -> dict:
    """Extract signatures for all functions in cv2."""
    result = {}

    for name in sorted(dir(cv2)):
        # Skip private/internal
        if name.startswith("_"):
            continue

        obj = getattr(cv2, name)

        # Only process callable functions (not classes, constants, modules)
        if not callable(obj):
            continue

        # Skip classes (we want functions, not constructors)
        if inspect.isclass(obj):
            continue

        # Skip submodules
        if inspect.ismodule(obj):
            continue

        doc = getattr(obj, "__doc__", None)
        if not doc:
            continue

        overloads = parse_signature(doc)
        if not overloads:
            continue

        # Try to extract type hints (stub first, heuristics as fallback)
        param_types = get_param_types_from_doc(name, doc)

        # Annotate params with types where we can
        for overload in overloads:
            for param in overload["params"]:
                if param["name"] in param_types:
                    param["type"] = param_types[param["name"]]

        result[name] = {
            "overloads": overloads,
        }

    return result


def main():
    print(f"OpenCV version: {cv2.__version__}", file=sys.stderr)

    stub_types = _get_stub_types()
    print(
        f"Stub file loaded: {'yes' if stub_types else 'no'} "
        f"({len(stub_types)} functions with type info)",
        file=sys.stderr,
    )

    signatures = extract_all_signatures()

    print(f"Extracted {len(signatures)} function signatures", file=sys.stderr)

    # Count how many have type info
    with_types = sum(
        1 for sig in signatures.values()
        for overload in sig["overloads"]
        if any("type" in p for p in overload["params"])
    )
    print(f"Overloads with at least one typed param: {with_types}", file=sys.stderr)

    output_path = Path(__file__).parent / "opencv-signatures.json"
    with open(output_path, "w") as f:
        json.dump(signatures, f, indent=2)

    print(f"Written to {output_path}", file=sys.stderr)

    # Print a few examples to stdout for quick review
    examples = ["GaussianBlur", "Canny", "cvtColor", "threshold", "Sobel", "dilate", "erode", "bitwise_not"]
    print("\n--- Sample signatures ---")
    for name in examples:
        if name in signatures:
            print(json.dumps({name: signatures[name]}, indent=2))


if __name__ == "__main__":
    main()
