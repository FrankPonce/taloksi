"""
Pull short Finnish–English sentence pairs from Tatoeba as *candidates* for new lessons.

Download (per-language exports) into data/raw/:
    https://downloads.tatoeba.org/exports/per_language/fin/fin_sentences.tsv.bz2
    https://downloads.tatoeba.org/exports/per_language/eng/eng_sentences.tsv.bz2
    https://downloads.tatoeba.org/exports/per_language/fin/fin-eng_links.tsv.bz2

Usage:
    python scripts/import_tatoeba.py --max-words 7 --containing kahvi,kauppa

Writes data/candidates/tatoeba_fi_en.json. Nothing goes into the app automatically:
quality on Tatoeba varies, so a human (ideally native) picks and edits each pair.

License: Tatoeba sentences are CC BY 2.0 FR — credit Tatoeba and keep sentence ids.
"""
import argparse
import bz2
import csv
import json
from pathlib import Path

from common import ROOT

RAW = ROOT / "data" / "raw"


def open_any(path: Path):
    if path.exists():
        return open(path, encoding="utf-8")
    bz = path.with_suffix(path.suffix + ".bz2")
    if bz.exists():
        return bz2.open(bz, "rt", encoding="utf-8")
    raise SystemExit(f"Missing {path} (or .bz2). See download links at the top of this file.")


def read_sentences(name):
    with open_any(RAW / name) as fh:
        return {row[0]: row[2] for row in csv.reader(fh, delimiter="\t", quoting=csv.QUOTE_NONE) if len(row) >= 3}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--max-words", type=int, default=7)
    ap.add_argument("--containing", default="", help="comma-separated Finnish substrings to require")
    ap.add_argument("--limit", type=int, default=500)
    args = ap.parse_args()

    fin = read_sentences("fin_sentences.tsv")
    eng = read_sentences("eng_sentences.tsv")
    needles = [n.strip().lower() for n in args.containing.split(",") if n.strip()]

    pairs, seen = [], set()
    with open_any(RAW / "fin-eng_links.tsv") as fh:
        for row in csv.reader(fh, delimiter="\t"):
            fid, eid = row[0], row[1]
            fi, en = fin.get(fid), eng.get(eid)
            if not fi or not en or fid in seen or len(fi.split()) > args.max_words:
                continue
            if needles and not any(n in fi.lower() for n in needles):
                continue
            seen.add(fid)
            pairs.append({"fi": fi, "en": en, "tatoeba_fi": int(fid), "tatoeba_en": int(eid), "reviewed": False})
            if len(pairs) >= args.limit:
                break

    out = ROOT / "data" / "candidates" / "tatoeba_fi_en.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(pairs, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(pairs)} candidate pairs -> {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
