# Sprint 2 — Voice and identity

**Dates:** Nov 2026 · **Status:** ✅ Done

| Role | Focus this sprint |
|---|---|
| Scrum Lead | Widened the sprint from "audio" to a playable MVP with its own look and voice |
| Content Quality | Lexicon for word-by-word breakdowns, culture notes, sourced study guide, 18+ pack |
| Documentation | Handoff, README, attribution, this review |
| Tech Lead | First real build and run, design system, character voices, new exercise engine |

## Goal

Get the app compiling and running, then make it feel like nothing else: its own visual style, a cast of characters with distinct voices, and teaching tools that generic apps do not have.

## Delivered

- **First run.** Installed and aligned packages for Expo SDK 54. Fixed two web bundling failures: a mismatched `expo-asset` pulled in by `expo-audio`, and zustand's ESM build using `import.meta` (solved in `metro.config.js`). Typecheck is clean.
- **"Kaamos Ink" design system.** Comic-ink look on a polar-night background: paper panels, 3px ink outlines, hard offset shadows, slanted labels, halftone texture. Barlow Condensed (display) and Barlow (body). Ionicons replace emoji. Tokens in `src/theme.ts`, kit in `src/components/ui.tsx`.
- **Cast of seven.** Norppa (mascot), Sofia, Pekka, Aino, Helvi, Mikko, Samir. Cel-shaded SVG portraits drawn in code (`src/components/art.tsx`), defined in `src/content/characters.json`. Every sentence and story line has a speaker.
- **Voices.** 381 clips, 100 % coverage. Two neural Finnish voices (Noora, Harri) are pitched and paced per character so the cast sounds like seven people. Spoken-Finnish variants are read by Aino. Piper remains available as an offline engine.
- **Sentence breakdowns.** `lexicon.json` holds 213 word forms with dictionary form, meaning, stem/ending split and an explanation. Any sentence can be taken apart in lesson feedback, flashcards, stories and grammar examples. The validator fails if a sentence contains a word the lexicon lacks.
- **Five new exercise types.** Odd one out, ending detective (what does this ending mean in this sentence), street Finnish (pick the spoken version), true or false, and long-or-short listening on sound-alike words. Lessons now open with a two-word warm-up drawn from earlier lessons.
- **Journey map.** Eleven stages from A1.1 to C2 with can-do statements, grammar, themes, a milestone and rough word and hour figures, mapped to YKI levels. Only A1.1 has lessons; the rest is the plan.
- **Study guide.** Eleven tips, each with steps, how the app supports it, and linked sources.
- **Culture.** Twelve notes (sauna, sisu, coffee, Turku, everyman's rights, holidays and more), linked from the units they belong to.
- **18+ pack.** A bonus unit (bar, swearing, dating) with two grammar notes and two culture notes, hidden behind a confirmed toggle. Adult words never appear as wrong answers in the main course.
- **Fixes from the Sprint 1 risk list.** Word-bank tiles no longer reveal the first word by its capital letter. Typo tolerance for Finnish answers now needs 9+ letters, so *maksa* is no longer accepted for *maksaa*.

## Metrics

| Metric | Value |
|---|---|
| Units | 5 (4 main + 1 bonus) |
| Lessons | 19 |
| Words / sentences | 139 / 102 |
| Lexicon word forms | 213 |
| Exercise types | 12 |
| Audio coverage | 381 / 381 |
| Validator errors | 0 |
| Type errors | 0 |

## Risks & next steps

- **Voice licence.** The clips come from `edge-tts`, which uses the Edge browser's read-aloud service. It is free but unofficial, and the terms for redistributing the audio are unclear. Decide before any public release: keep it, move to Piper (one voice), or record real speakers.
- **Content is still AI-drafted.** That now includes the lexicon explanations, culture notes and the 18+ pack. Sprint 3 (native review) matters more than before.
- **Only verified on web.** Not yet run in Expo Go on a phone. `boxShadow` and `skewX` need the new architecture on Android.
- **Journey stages A1.2 onward are a plan, not content.**
- No git history yet.
