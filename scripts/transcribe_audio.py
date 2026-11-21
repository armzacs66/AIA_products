# /// script
# requires-python = ">=3.11,<3.14"
# dependencies = ["torch", "transformers>=4.40", "accelerate", "av", "numpy"]
# [tool.uv.sources]
# torch = { index = "pytorch-cu124" }
# [[tool.uv.index]]
# name = "pytorch-cu124"
# url = "https://download.pytorch.org/whl/cu124"
# explicit = true
# ///
"""Transcribe Thai audio (m4a/mp3/wav) with a Thai-tuned Whisper. No ffmpeg needed (PyAV).

Usage: uv run transcribe_audio.py <audio-dir> <out-dir>
"""
from __future__ import annotations

import logging
import sys
from pathlib import Path

import av
import numpy as np

log = logging.getLogger("transcribe")
MODEL_ID = "biodatlab/whisper-th-large-v3-combined"
EXT = {".m4a", ".mp3", ".wav", ".mp4", ".flac"}


def load_audio(path: Path) -> np.ndarray:
    """Decode to 16 kHz mono float32."""
    res = av.AudioResampler(format="flt", layout="mono", rate=16000)
    parts: list[np.ndarray] = []
    with av.open(str(path)) as c:
        for frame in c.decode(audio=0):
            for f in res.resample(frame):
                parts.append(f.to_ndarray().reshape(-1))
    for f in res.resample(None):
        parts.append(f.to_ndarray().reshape(-1))
    return np.concatenate(parts)


def fmt(t: float) -> str:
    return f"{int(t // 3600):02d}:{int(t % 3600 // 60):02d}:{int(t % 60):02d}"


def main() -> int:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(message)s", stream=sys.stderr)
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    dst.mkdir(parents=True, exist_ok=True)
    import torch
    from transformers import pipeline

    dev = 0 if torch.cuda.is_available() else -1
    asr = pipeline(
        "automatic-speech-recognition",
        model=MODEL_ID,
        torch_dtype=torch.float16 if dev == 0 else torch.float32,
        device=dev,
        chunk_length_s=30,
        batch_size=8,
    )
    log.info("model loaded on %s", "cuda" if dev == 0 else "cpu")
    for i, f in enumerate(sorted(p for p in src.iterdir() if p.suffix.lower() in EXT), 1):
        out = dst / f"audio-{i}.txt"
        if out.exists():
            log.info("skip %s", f.name)
            continue
        log.info("decoding %s", f.name)
        audio = load_audio(f)
        log.info("transcribing %.1f min", len(audio) / 16000 / 60)
        res = asr(
            {"raw": audio, "sampling_rate": 16000},
            return_timestamps=True,
            generate_kwargs={"language": "th", "task": "transcribe"},
        )
        lines = [f"# {f.name}", ""]
        for ch in res["chunks"]:
            ts = ch["timestamp"][0] or 0.0
            lines.append(f"[{fmt(ts)}] {ch['text'].strip()}")
        out.write_text("\n".join(lines), encoding="utf-8")
        log.info("wrote %s", out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
