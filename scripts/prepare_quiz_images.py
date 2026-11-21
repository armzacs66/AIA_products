# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow"]
# ///
"""Copy slide images referenced by content/quiz/questions.json into public/quiz-img (resized)."""
import json
import sys
from pathlib import Path

from PIL import Image, ImageOps

root = Path(__file__).resolve().parent.parent
qs = json.loads((root / "content/quiz/questions.json").read_text(encoding="utf-8"))
names = sorted({s for q in qs for s in q["src"]})
out = root / "public/quiz-img"
out.mkdir(parents=True, exist_ok=True)
missing = []
for n in names:
    p = root / "Contents/Image" / n
    if not p.exists():
        missing.append(n)
        continue
    im = ImageOps.exif_transpose(Image.open(p)).convert("RGB")
    im.thumbnail((1100, 1100))
    im.save(out / n, quality=72, optimize=True)
print(f"{len(names) - len(missing)} images written, missing: {missing}")
sys.exit(1 if missing else 0)
