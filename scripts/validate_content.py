"""
Sanity checks for course content. Run before every commit:
    python scripts/validate_content.py
Exits with code 1 if anything is broken.
"""
import re
import sys

from common import (
    AUDIO_DIR,
    load_characters,
    load_culture,
    load_curriculum,
    load_dialogues,
    load_guide,
    load_gym,
    load_lexicon,
    load_sets,
    load_stories,
    load_units,
    speakable_items,
    tokens,
)

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

errors, warnings = [], []
ids = {}


def claim(id_, where):
    if id_ in ids:
        errors.append(f"Duplicate id '{id_}' in {where} (first seen in {ids[id_]})")
    ids[id_] = where


characters = {c["id"] for c in load_characters()}
lexicon = load_lexicon()
missing_words = {}


def check_breakdown(id_, sentence):
    """Every word of every sentence must be in the lexicon, or the breakdown view has a hole."""
    for t in tokens(sentence):
        if t.lower() not in lexicon:
            missing_words.setdefault(t.lower(), id_)


def check_speaker(id_, speaker):
    if speaker and speaker not in characters:
        errors.append(f"{id_}: speaker '{speaker}' is not in characters.json")


units = load_units()
unit_ids = {u["id"] for u in units}
lesson_ids, grammar_ids, all_words = set(), set(), set()
POS = {"noun", "verb", "adj", "adv", "pron", "num", "question", "particle", "phrase"}
n_pictures = 0
for u in units:
    if not u.get("reviewed"):
        warnings.append(f"{u['id']} '{u['titleEn']}' has not had a review pass yet (see docs/CONTENT.md)")
    if u.get("track", "main") not in {"main", "adult"}:
        errors.append(f"{u['id']}: unknown track '{u['track']}'")
    for g in u["grammar"]:
        claim(g["id"], u["id"])
        grammar_ids.add(g["id"])
for u in units:
    for l in u["lessons"]:
        claim(l["id"], u["id"])
        lesson_ids.add(l["id"])
        if l.get("grammar") and l["grammar"] not in grammar_ids:
            errors.append(f"{l['id']}: grammar note '{l['grammar']}' does not exist")
        if not l.get("host"):
            errors.append(f"{l['id']}: no host character")
        check_speaker(l["id"], l.get("host"))
        if u.get("track", "main") != "adult" and next((c for c in load_characters() if c["id"] == l.get("host")), {}).get("adult"):
            errors.append(f"{l['id']}: an 18+ character hosts a main-course lesson")
        guests = {s_["speaker"] for s_ in l["sentences"] if s_.get("speaker") != l.get("host")}
        if len(guests) > 2:
            warnings.append(f"{l['id']}: {len(guests)} guest speakers besides the host; keep it to one voice where you can")
        if len(l["words"]) < 3:
            warnings.append(f"{l['id']}: fewer than 3 words (match exercise is skipped)")
        for w in l["words"]:
            claim(w["id"], l["id"])
            all_words.add(w["fi"])
            if not w["fi"].strip() or not w["en"].strip():
                errors.append(f"{w['id']}: empty fi/en")
            if w.get("pos") not in POS:
                errors.append(f"{w['id']}: missing or unknown word type (pos) '{w.get('pos')}'")
            if w.get("icon"):
                n_pictures += 1
        for s in l["sentences"]:
            claim(s["id"], l["id"])
            if not re.search(r"[.!?]$", s["fi"]):
                warnings.append(f"{s['id']}: Finnish sentence has no end punctuation")
            if not s.get("speaker"):
                errors.append(f"{s['id']}: no speaker")
            check_speaker(s["id"], s.get("speaker"))
            check_breakdown(s["id"], s["fi"])
        for f in l.get("fill", []):
            claim(f["id"], l["id"])
            if f["answer"] not in f["options"]:
                errors.append(f"{f['id']}: answer '{f['answer']}' not among options")
            if len(set(f["options"])) != len(f["options"]):
                errors.append(f"{f['id']}: duplicate options")

for st in load_stories():
    claim(st["id"], "stories")
    if st["unlockAfter"] not in lesson_ids:
        errors.append(f"{st['id']}: unlockAfter '{st['unlockAfter']}' is not a lesson")
    for line in st["lines"]:
        claim(line["id"], st["id"])
        check_speaker(line["id"], line.get("speakerId"))
        check_breakdown(line["id"], line["fi"])
    for q in st["questions"]:
        if not 0 <= q["answer"] < len(q["choices"]):
            errors.append(f"{st['id']}: answer index out of range in '{q['q']}'")

for word, where in sorted(missing_words.items()):
    errors.append(f"lexicon.json has no entry for '{word}' (used in {where})")
for key, entry in lexicon.items():
    if len(entry) < 4:
        errors.append(f"lexicon '{key}': needs [lemma, meaning, segments, explanation]")
    elif entry[2].replace("|", "").lower() != key:
        errors.append(f"lexicon '{key}': segments '{entry[2]}' do not spell the word")

for d in load_dialogues():
    claim(d["id"], "dialogues")
    if d["lesson"] not in lesson_ids:
        errors.append(f"{d['id']}: lesson '{d['lesson']}' does not exist")
    check_speaker(d["id"], d["with"])
    for turn in d["turns"]:
        check_breakdown(d["id"], turn["them"]["fi"])
        check_breakdown(d["id"], turn["you"]["fi"])

gym = load_gym()
for n in gym["nouns"]:
    if len(n["forms"]) != 10:
        errors.append(f"gym noun {n['fi']}: expected 10 case forms")
for v in gym["verbs"]:
    if len(v["forms"]) != 6 or len(v["puhe"]) != 6:
        errors.append(f"gym verb {v['inf']}: expected 6 + 6 forms")

sets = load_sets()
seen = {}
for cat in sets["categories"]:
    if len(cat["words"]) < 3:
        errors.append(f"category {cat['id']}: needs at least 3 words")
    for w in cat["words"]:
        if w not in all_words:
            warnings.append(f"category {cat['id']}: '{w}' is not taught in any lesson")
        if w in seen:
            errors.append(f"'{w}' is in two categories ({seen[w]} and {cat['id']}): odd-one-out would be ambiguous")
        seen[w] = cat["id"]
for pair in sets["minimalPairs"]:
    claim(pair["id"], "sets")
    if len(pair["words"]) < 2:
        errors.append(f"{pair['id']}: needs at least 2 words")

for note in load_culture():
    claim(note["id"], "culture")
    if note.get("unit") and note["unit"] not in unit_ids:
        errors.append(f"{note['id']}: unit '{note['unit']}' does not exist")
curriculum = load_curriculum()
for stage in curriculum["stages"]:
    claim(stage["id"], "curriculum")
    for uid in stage["units"]:
        if uid not in unit_ids:
            errors.append(f"stage {stage['id']}: unit '{uid}' does not exist")
    if stage["status"] == "available" and not stage["units"]:
        errors.append(f"stage {stage['id']}: marked available but has no units")
for tip in load_guide():
    claim(tip["id"], "guide")
    if not tip.get("sources"):
        errors.append(f"{tip['id']}: every study tip needs at least one source")

speak = list(speakable_items())
have = {p.stem for p in AUDIO_DIR.glob("*") if p.suffix in {".wav", ".mp3"}} if AUDIO_DIR.exists() else set()
missing = [i for i, _, _ in speak if i not in have]

n_words = sum(len(l["words"]) for u in units for l in u["lessons"])
n_sent = sum(len(l["sentences"]) for u in units for l in u["lessons"])
print(f"Units {len(units)} · lessons {len(lesson_ids)} · words {n_words} · sentences {n_sent} · "
      f"grammar notes {len(grammar_ids)} · stories {len(load_stories())} · gym nouns {len(gym['nouns'])} · gym verbs {len(gym['verbs'])}")
print(f"Words with a picture {n_pictures}/{n_words}")
print(f"Lexicon {len(lexicon)} word forms · culture notes {len(load_culture())} · study tips {len(load_guide())} · "
      f"journey stages {len(curriculum['stages'])} · characters {len(characters)}")
print(f"Audio: {len(speak) - len(missing)}/{len(speak)} clips generated"
      + ("" if not missing else " (run: npm run audio)"))
for w in warnings:
    print("WARN ", w)
for e in errors:
    print("ERROR", e)
sys.exit(1 if errors else 0)
