# Sprint 1 — Foundations

**Dates:** Nov 2026 · **Status:** ✅ Done

| Role | Focus this sprint |
|---|---|
| Scrum Lead | Scoped v0.1 to "everything Duolingo/LingoDeer do offline, for A1" |
| Content Quality | Drafted 4 units with kirjakieli + puhekieli; built the validator |
| Documentation | README, roadmap, feature matrix, this review |
| Tech Lead | Expo Router architecture, engine/content split, FSRS integration |

## Goal

A working universal app (web + iOS + Android) with a complete learning loop: learn → practise → review → come back tomorrow.

## Delivered

- **App shell:** Expo Router with 4 tabs (Opi, Kertaa, Harjoittele, Profiili) plus lesson, grammar, story and gym screens.
- **Exercise engine:** lessons are generated from content (intro → pick → match → sentence building → listening → typing → fill-ins), so adding a lesson needs no code.
- **Answer checking:** English contractions, alternative translations, one-letter typos, and lenient ä/ö with a reminder.
- **Spaced repetition:** every finished lesson seeds FSRS cards; review grades Again / Hard / Good / Easy.
- **Gamification:** XP, daily goal, streak (+ best streak), hearts with 30-min refill, 11 achievements.
- **Content:** 4 units, 16 lessons, 115 words, 83 sentences, 13 grammar notes, 2 stories, 14 nouns × 10 cases, 12 verbs × 6 persons × 2 registers.
- **Pipelines:** Piper audio generator, kaikki.org noun importer, Tatoeba candidate importer, content validator.

## Metrics

| Metric | Value |
|---|---|
| Lessons | 16 |
| Exercises per lesson | 22–32 |
| Speakable items needing audio | 298 |
| Validator errors | 0 |
| Units reviewed by a native speaker | 0 / 4 |

## Risks & next steps

- Content accuracy is the biggest risk → Sprint 3 is a dedicated native review.
- Device TTS quality varies by OS → Sprint 2 generates Piper clips for everything.
- No accounts yet; progress lives on the device → Sprint 6.
