#!/usr/bin/env python3
"""
R94b: check-no-emoji.py

PCRE scan over 7 unicode blocks for emoji in src/ + public/ + scripts/.
Roman's hard rule: 0 emoji anywhere in the public site.

Exit 0 on PASS, exit 1 on FAIL.
Prints PASS/FAIL counts and a per-file list of hits.
"""
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCAN_DIRS = ["src", "public", "scripts"]
EXTS = {".astro", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css", ".svg", ".html", ".json", ".md", ".mdx", ".txt", ".xml", ".py"}

# Seven unicode blocks Roman flagged (covers 99% of emoji on web + mobile).
# Blocks: Misc Symbols, Misc Symbols & Pictographs, Emoticons, Transport,
# Geometric Shapes, Supplemental Symbols & Pictographs, Symbols & Pictographs (extended).
EMOJI_RANGES = [
    (0x2600, 0x26FF),   # Misc Symbols
    (0x2700, 0x27BF),   # Dingbats
    (0x1F300, 0x1F5FF), # Misc Symbols & Pictographs
    (0x1F600, 0x1F64F), # Emoticons
    (0x1F680, 0x1F6FF), # Transport & Map
    (0x1F700, 0x1F77F), # Alchemical
    (0x1F900, 0x1F9FF), # Supplemental Symbols & Pictographs
    (0x1FA70, 0x1FAFF), # Symbols & Pictographs (extended)
    (0x1F1E6, 0x1F1FF), # Regional Indicator (flags)
]

PATTERN = re.compile("|".join(f"[{chr(lo)}-{chr(hi)}]" for lo, hi in EMOJI_RANGES))


def scan_file(path: Path):
    try:
        text = path.read_text(encoding="utf-8")
    except Exception as e:
        return [(0, f"<read error: {e}>")]
    hits = []
    for m in PATTERN.finditer(text):
        line = text.count("\n", 0, m.start()) + 1
        hits.append((line, repr(m.group(0))))
    return hits


def main():
    files = []
    for d in SCAN_DIRS:
        p = ROOT / d
        if not p.exists():
            continue
        for root, _, names in os.walk(p):
            for n in names:
                fp = Path(root) / n
                if fp.suffix.lower() in EXTS:
                    files.append(fp)

    files.sort()
    fail_files = []
    total_hits = 0
    for fp in files:
        hits = scan_file(fp)
        if hits:
            fail_files.append((fp, hits))
            total_hits += len(hits)

    if fail_files:
        print(f"FAIL: {total_hits} emoji hit(s) across {len(fail_files)} file(s).")
        for fp, hits in fail_files:
            rel = fp.relative_to(ROOT)
            for line, char in hits:
                print(f"  {rel}:{line}  {char}")
        sys.exit(1)
    else:
        print(f"PASS: 0 emoji in {len(files)} file(s) across {SCAN_DIRS}.")
        sys.exit(0)


if __name__ == "__main__":
    main()
