# Sprint 3 — Starter and structure

**Dates:** Nov 2026 · **Status:** ✅ Done

| Role | Focus this sprint |
|---|---|
| Scrum Lead | Dropped the native-review sprint (nobody available) and replaced it with this one; moved word-frequency work (C7) to sprint 7 |
| Content Quality | Rewrote units 1–4 so no lesson uses grammar before explaining it; review pass on units 0–4 |
| Documentation | Roadmap, content guide, handoff, README, this review |
| Tech Lead | Concept cards, starter steps, the first-contact rule in the validator |

## Goal

Give the course a proper beginning, and make it introduce Finnish one idea at a time: a word appears in its plain form first, and an ending is never used before a card has explained it.

## Delivered

- **Unit 0, "Alkeet · Start here".** Four starter lessons: letters and sounds, long and short sounds, vowel harmony, how a sentence works. They are authored step by step (`steps` in `units/unit0.json`) rather than generated. The unit is optional: it has its own unlock chain, and unit 1 is open from the start. This is a change from the roadmap, which planned a five-question skip test; with nothing gated there is nothing to skip.
- **Concept cards.** 14 cards in `src/content/concepts.json`, each opening the first lesson to use an ending: persons of olla, negation, questions, from, in, the partitive (three cards: languages, numbers, food), by/with, the whole object, of/'s, into, having. Each card is followed by two generated questions on that ending alone (`conceptPractice` in `engine/exercises.ts`). The card screen is `components/exercises/Concept.tsx`.
- **The strict first-contact rule, enforced.** `scripts/validate_content.py` now fails any sentence, fill-in, conversation line or story line that uses an ending before its card, or a changed form of a word that has not appeared plain in an earlier lesson. Words and phrases taught whole are exempt. Every changed form in the lexicon now carries an ending tag. Run against the previous course content, the check finds 130 problems; on the new content it finds none.
- **Units 1–4 rewritten.** New order in unit 2 (countries and languages → from → in → speaking a language) so every form is met plain first. Numbers moved to the start of unit 3 as lesson `u3l0`. Most sentences were rewritten; lessons now teach nouns in their plain form and use them with endings in the lessons after. Seven phrases are taught whole, such as *minun nimeni on* and *puhutko englantia*.
- **Audio.** 190 clips generated for new and changed lines, 15 unused clips deleted. The audio script now runs on Python 3.7.

## Review pass

Claude read every sentence, spoken form, translation, fill-in, conversation line, concept card, grammar note and lexicon entry in units 0–4 against `docs/CONTENT.md`. This is not a native speaker's check.

| Category | Found | Fixed |
|---|---|---|
| Grammar used before it was explained | 130 (validator, old content) | All, by rewriting |
| Misleading gloss | 1: *onko* was glossed "is there / does … have" | Now "is … ?", with the having use explained |
| Ambiguous sentence | 1: "Suomi on vaikea kieli" reads as "Finland is a difficult language" before the language word is taught | Note added on the sentence |
| Simplified fact | 1: "Suomessa on kaksi kieltä" | Kept for its simple grammar; the fact note says these are the two national languages and that the Sámi languages also have official status |

Not reviewed: the 18+ units (x1, x2), which also are not covered by the first-contact rule because they unlock on their own.

## Metrics

| Metric | Value |
|---|---|
| Lessons | 26 (21 + 4 starter + 1 moved) |
| Concept cards | 14, plus 7 inside the starter |
| First-contact problems | 0 (130 before) |
| Units with a review pass | 5 of 7 |
| Audio clips | 550 |

## Risks & next steps

- The rule makes lessons stricter: a lesson's own nouns appear only in their plain form, so some lessons have simpler sentences than before. Watch whether that feels slow in play.
- Lessons are still about 30 steps; shortening them is sprint 7.
- Phone testing is still not done. It is part of sprint 6.
- Next: sprint 4, the exam-prep engine.
