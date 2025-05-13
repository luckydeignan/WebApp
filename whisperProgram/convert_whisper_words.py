#!/usr/bin/env python3
"""
convert_whisper_words.py

Convert Whisper’s rich‑JSON (segments → words) into a flat list like
[
    {"text": " The", "timestamp": [0.50, 0.64]},
    …
]
Usage
-----
    python convert_whisper_words.py whisper_output.json -o words.json
If ‑o/‑‑output is omitted the result is printed to stdout.
"""
import json
import argparse
from pathlib import Path
from typing import List, Dict, Any


def flatten_words(data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Extract every word and its [start, end] timestamps."""
    flat: List[Dict[str, Any]] = []
    for segment in data.get("segments", []):
        for w in segment.get("words", []):
            flat.append(
                {
                    "text": w["word"],
                    "timestamp": [w["start"], w["end"]],
                }
            )
    return flat


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Convert Whisper JSON (with segments/words) "
        "to a flat word‑timestamp list."
    )
    parser.add_argument("input", help="path to the Whisper JSON file")
    parser.add_argument(
        "-o", "--output", help="where to write the converted JSON "
        "(default: print to stdout)"
    )
    args = parser.parse_args()

    in_path = Path(args.input)
    if not in_path.exists():
        raise FileNotFoundError(in_path)

    with in_path.open(encoding="utf‑8") as f:
        whisper_json = json.load(f)

    words = flatten_words(whisper_json)

    if args.output:
        out_path = Path(args.output)
        out_path.write_text(json.dumps(words, ensure_ascii=False, indent=4))
        print(f"Wrote {len(words)} word entries to {out_path}")
    else:
        print(json.dumps(words, ensure_ascii=False, indent=4))


if __name__ == "__main__":
    main()
