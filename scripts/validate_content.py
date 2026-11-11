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
    load_concepts,
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
        if u.get("starter"):
            for i, step in enumerate(l.get("steps", [])):
                if step["type"] == "choice" and step["answer"] not in step["choices"]:
                    errors.append(f"{l['id']} step {i}: answer '{step['answer']}' not among choices")
                if step["type"] == "hear" and step["pair"] not in {p["id"] for p in load_sets()["minimalPairs"]}:
                    errors.append(f"{l['id']} step {i}: no minimal pair '{step['pair']}'")
                if step["type"] == "card":
                    claim(step["card"]["id"], l["id"])
            if not l.get("steps"):
                errors.append(f"{l['id']}: a starter lesson needs steps")
        elif len(l["words"]) < 3:
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

# ── Concept cards and the first-contact rule ─────────────────────────────────
# Strict version, decided 2026-11-11 (docs/ROADMAP.md section 7):
#   1. a noun-like word is met in its plain form in an EARLIER lesson before any other form of it;
#   2. an ending (lexicon tag) is only used from the lesson whose concept card introduces it;
#   3. anything taught whole as a word or phrase is exempt from both, as a fixed phrase.
# It applies to the main course: sentences, fill-ins, conversations and stories. The 18+ track
# unlocks on its own and is not checked.
VERB_TAGS = {"p1", "p2", "p3", "p4", "p5", "p6", "q", "neg", "imp", "cond", "pass"}
NOUN_TAGS = {"ine", "ela", "ill", "ade", "abl", "all", "par", "gen", "acc", "pl", "px", "cmp", "sup", "ess", "tra"}
concepts = load_concepts()
gate = {}
for c in concepts:
    claim(c["id"], "concepts")
    if c["lesson"] not in lesson_ids:
        errors.append(f"{c['id']}: lesson '{c['lesson']}' does not exist")
    if len(c["examples"]) < 3:
        errors.append(f"{c['id']}: needs at least 3 examples for its practice questions")
    if len({e["en"] for e in c["examples"]}) != len(c["examples"]):
        errors.append(f"{c['id']}: two examples share a meaning, so 'what does it mean?' would be ambiguous")
    for e in c["examples"]:
        if e["fi"] in e.get("wrong", []):
            errors.append(f"{c['id']}: '{e['fi']}' is listed as both right and wrong")
    for t in c.get("tags", []):
        if t not in VERB_TAGS | NOUN_TAGS:
            errors.append(f"{c['id']}: unknown tag '{t}'")
        if t in gate:
            errors.append(f"{c['id']}: tag '{t}' is already introduced by {gate[t]}")
        gate.setdefault(t, c["id"])
for key, entry in lexicon.items():
    if len(entry) > 4 and entry[4] not in VERB_TAGS | NOUN_TAGS:
        errors.append(f"lexicon '{key}': unknown tag '{entry[4]}'")

main_lessons = [l for u in units if u.get("track", "main") == "main" for l in u["lessons"] if not u.get("starter")]
position = {l["id"]: i for i, l in enumerate(main_lessons)}
card_at = {c["lesson"]: c for c in concepts}
dialogues_by_lesson = {}
for d in load_dialogues():
    dialogues_by_lesson.setdefault(d["lesson"], []).append(d)
stories_by_lesson = {}
for st in load_stories():
    stories_by_lesson.setdefault(st["unlockAfter"], []).append(st)

introduced = set()  # tags whose card has been shown
chunks = set()      # word forms taught whole, up to and including this lesson
seen_before = set()  # base forms met in earlier lessons
rule_errors = 0
for l in main_lessons:
    for c in concepts:
        if c["lesson"] == l["id"]:
            introduced.update(c.get("tags", []))
    taught_here = set()
    for w in l["words"]:
        for t in tokens(w["fi"]):
            chunks.add(t.lower())
            taught_here.add(t.lower())
    texts = [(s["id"], s["fi"]) for s in l["sentences"]]
    texts += [(f["id"], f"{f['before']} {f['answer']} {f['after']}") for f in l.get("fill", [])]
    for d in dialogues_by_lesson.get(l["id"], []):
        texts += [(d["id"], t[k]["fi"]) for t in d["turns"] for k in ("them", "you")]
    for st in stories_by_lesson.get(l["id"], []):
        texts += [(line["id"], line["fi"]) for line in st["lines"]]
    plain_here = set()
    for id_, text in texts:
        for tok in tokens(text):
            low = tok.lower()
            e = lexicon.get(low)
            if not e:
                continue
            lemma = e[0].lower()
            tag = e[4] if len(e) > 4 else None
            if lemma == low and not tag:
                plain_here.add(low)
                continue
            if low in chunks:
                continue
            if not tag:
                errors.append(f"{id_}: '{tok}' is a changed form of '{e[0]}' but has no ending tag in lexicon.json")
                rule_errors += 1
                continue
            if tag not in introduced:
                where = gate.get(tag)
                errors.append(f"{id_}: '{tok}' uses the ending '{tag}' before its concept card"
                              + (f" ({where}, {next(c['lesson'] for c in concepts if c['id'] == where)})" if where else " (no card introduces it yet)"))
                rule_errors += 1
            if tag in NOUN_TAGS and lemma != low and lemma not in seen_before:
                errors.append(f"{id_}: '{tok}' is a form of '{e[0]}', which has not appeared in its plain form in an earlier lesson")
                rule_errors += 1
    seen_before |= taught_here | plain_here | {t for t in chunks}

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
print(f"First-contact rule: {len(main_lessons)} main-course lessons checked, {len(concepts)} concept cards, "
      f"{rule_errors} problem{'s' if rule_errors != 1 else ''}")
print(f"Audio: {len(speak) - len(missing)}/{len(speak)} clips generated"
      + ("" if not missing else " (run: npm run audio)"))
for w in warnings:
    print("WARN ", w)
for e in errors:
    print("ERROR", e)
sys.exit(1 if errors else 0)
