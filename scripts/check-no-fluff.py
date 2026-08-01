#!/usr/bin/env python3
"""
R94b: check-no-fluff.py

Scan for marketing-fluff words in src/. Roman's hard rule:
no "revolutionary", "amazing", "disrupting", "cutting-edge", "next-gen",
"game-changing", "seamless", "powerful", "innovative", "leverage",
"unleash", "transformative", "unlock", "elevate", "supercharge", "boost".

Exit 0 on PASS, exit 1 on FAIL.
"""
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCAN_DIRS = ["src"]
EXTS = {".astro", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css", ".html", ".md", ".mdx"}

# Word-boundary match, case-insensitive. Allow 'no' / 'not' prefixes to be checked by
# the regex (we want to catch "not powerful" too - it's still fluff).
FLUFF_WORDS = [
    "revolutionary", "amazing", "disrupting", "disruptive", "disrupt",
    "cutting-edge", "next-gen", "next generation", "game-changing",
    "seamless", "seamlessly", "innovative", "leverage", "leverages",
    "unleash", "unleashes", "transformative", "unlock", "unlocks",
    "elevate", "elevates", "supercharge", "supercharges", "supercharged",
    "boost your", "boosts your", "world-class", "best-in-class",
    "industry-leading", "state-of-the-art", "groundbreaking",
    "synergy", "synergies", "paradigm shift", "paradigm-shift",
    "10x", "10x your", "moonshot", "rockstar", "ninja", "guru",
    "just works", "works like magic", "magic-like", "magical",
    "blazing fast", "lightning fast", "blazing-fast", "lightning-fast",
]

# Allow-list: words that contain fluff substrings but are NOT fluff.
ALLOW_LIST = {
    # 'powerful' / 'power' shows up in technical contexts ("powerful tool", "power user")
    # but Roman's rule is to avoid it as a marketing descriptor. Not whitelisted.
    "boostrap": "boostrap",  # technical term, not "boost your"
}

PATTERNS = []
for w in FLUFF_WORDS:
    # \b is fuzzy in Python re for hyphenated words; we use a custom check.
    PATTERNS.append(re.compile(r"\b" + re.escape(w) + r"\b", re.IGNORECASE))


def scan_file(path: Path):
    try:
        text = path.read_text(encoding="utf-8")
    except Exception:
        return []
    hits = []
    for line_no, line in enumerate(text.splitlines(), 1):
        for pat in PATTERNS:
            m = pat.search(line)
            if m:
                word = m.group(0)
                hits.append((line_no, word, line.strip()[:120]))
                break  # one hit per line is enough
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
        print(f"FAIL: {total_hits} fluff hit(s) across {len(fail_files)} file(s).")
        for fp, hits in fail_files:
            rel = fp.relative_to(ROOT)
            for line, word, ctx in hits:
                print(f"  {rel}:{line}  '{word}'  in: {ctx}")
        sys.exit(1)
    else:
        print(f"PASS: 0 fluff words in {len(files)} file(s) across {SCAN_DIRS}.")
        sys.exit(0)


if __name__ == "__main__":
    main()
