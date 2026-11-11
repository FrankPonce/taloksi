"""
Build case-gym nouns from Wiktionary inflection tables (via kaikki.org).

Download the Finnish dump (JSON lines, ~1 GB unpacked) from:
    https://kaikki.org/dictionary/Finnish/
and save it as data/raw/kaikki-finnish.jsonl

Usage:
    python scripts/import_kaikki.py --words talo,auto,järvi,ystävä
    python scripts/import_kaikki.py --from-course          # every noun-looking word in the course

Writes data/generated/kaikki_nouns.json in the same shape as src/content/gym.json.
Review the output, then merge good entries into gym.json.

License: Wiktionary content is CC BY-SA 4.0 — keep ATTRIBUTION.md up to date.
"""
import argparse
import json
from pathlib import Path

from common import ROOT, load_units

TAG_TO_CASE = {
    "genitive": "genetiivi", "partitive": "partitiivi", "inessive": "inessiivi", "elative": "elatiivi",
    "illative": "illatiivi", "adessive": "adessiivi", "ablative": "ablatiivi", "allative": "allatiivi",
    "essive": "essiivi", "translative": "translatiivi",
}
SKIP_TAGS = {"plural", "possessive", "rare", "archaic", "dialectal", "first-person", "second-person", "third-person"}


def extract(entry):
    forms = {}
    for f in entry.get("forms", []):
        tags = set(f.get("tags", []))
        if "singular" not in tags or tags & SKIP_TAGS:
            continue
        for tag, case in TAG_TO_CASE.items():
            if tag in tags and case not in forms:
                forms[case] = f["form"]
    return forms if len(forms) == len(TAG_TO_CASE) else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dump", default=str(ROOT / "data" / "raw" / "kaikki-finnish.jsonl"))
    ap.add_argument("--words", default="")
    ap.add_argument("--from-course", action="store_true")
    args = ap.parse_args()

    wanted = {w.strip() for w in args.words.split(",") if w.strip()}
    if args.from_course:
        for u in load_units():
            for l in u["lessons"]:
                wanted |= {w["fi"] for w in l["words"] if " " not in w["fi"]}

    found = {}
    with open(args.dump, encoding="utf-8") as fh:
        for line in fh:
            e = json.loads(line)
            if e.get("pos") != "noun" or e.get("word") not in wanted or e["word"] in found:
                continue
            forms = extract(e)
            if forms:
                gloss = next((g for s in e.get("senses", []) for g in s.get("glosses", [])), "")
                found[e["word"]] = {"fi": e["word"], "en": gloss, "forms": forms, "source": "wiktionary"}

    out = ROOT / "data" / "generated" / "kaikki_nouns.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(list(found.values()), ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(found)}/{len(wanted)} nouns with full tables -> {out.relative_to(ROOT)}")
    missing = sorted(wanted - set(found))
    if missing:
        print("Not found / not nouns:", ", ".join(missing))


if __name__ == "__main__":
    main()
