"""Shared helpers for content scripts."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "src" / "content"
AUDIO_DIR = ROOT / "assets" / "audio"


def _load(name):
    return json.loads((CONTENT / name).read_text(encoding="utf-8"))


def load_units():
    return [json.loads(p.read_text(encoding="utf-8")) for p in sorted((CONTENT / "units").glob("unit*.json"))]


def load_stories():
    return _load("stories.json")


def load_gym():
    return _load("gym.json")


def load_characters():
    return _load("characters.json")


def load_concepts():
    return _load("concepts.json")


def card_audio(card):
    """(audio_id, text) for each example on a concept card; examples that reuse a clip are skipped."""
    for i, ex in enumerate(card["examples"]):
        if not ex.get("audio"):
            yield f'{card["id"]}_{i}', ex["fi"]


def load_lexicon():
    return {k: v for k, v in _load("lexicon.json").items() if not k.startswith("_")}


def load_sets():
    return _load("sets.json")


def load_dialogues():
    return _load("dialogues.json")


def load_culture():
    return _load("culture.json")


def load_curriculum():
    return _load("curriculum.json")


def load_guide():
    return _load("guide.json")


def tokens(sentence):
    """Words of a sentence, the same way the app splits them."""
    return [t for t in re.sub(r'[.,!?;:"“”]', "", sentence).split() if t]


def speakable_items():
    """Yield (audio_id, finnish_text, speaker_id or None) for everything the app can play.

    Words have no speaker and get the narrator voice. Spoken-Finnish (puhekieli)
    variants are always read by Aino, who speaks nothing else.
    """
    for unit in load_units():
        for lesson in unit["lessons"]:
            for i, step in enumerate(lesson.get("steps", [])):
                if step["type"] == "card":
                    for audio_id, text in card_audio(step["card"]):
                        yield audio_id, text, None
                elif step["type"] == "choice" and (step.get("fi") or step.get("listen")):
                    yield f'{lesson["id"]}_{i}', step.get("listen") or step["fi"], None
            for word in lesson["words"]:
                yield word["id"], word["fi"], None
                if word.get("puhe"):
                    yield f'{word["id"]}__puhe', word["puhe"], "aino"
            for s in lesson["sentences"]:
                yield s["id"], s["fi"], s.get("speaker")
                if s.get("puhe"):
                    yield f'{s["id"]}__puhe', s["puhe"], "aino"
    for story in load_stories():
        for line in story["lines"]:
            yield line["id"], line["fi"], line.get("speakerId")
    for pair in load_sets()["minimalPairs"]:
        for w in pair["words"]:
            yield f'mp_{w["fi"]}', w["fi"], None
    for c in load_characters():
        yield f'cast_{c["id"]}', c["hello"], c["id"]
    for card in load_concepts():
        for audio_id, text in card_audio(card):
            yield audio_id, text, None
    for d in load_dialogues():
        for i, turn in enumerate(d["turns"]):
            yield f'{d["id"]}_{i}', turn["them"]["fi"], d["with"]
