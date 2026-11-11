<div align="center">

# 🦭 Suomeksi

**Learn Finnish the way it's actually spoken.**
A free, open-source Duolingo / LingoDeer-style app built *only* for Finnish — cases, consonant gradation and puhekieli included.

Expo (React Native) · TypeScript · FSRS spaced repetition · neural character voices · Web + iOS + Android from one codebase

</div>

---

## Why another language app?

Generic apps treat Finnish like any other language. Learners struggle with the things that make Finnish *Finnish*:

- **15 grammatical cases** and **consonant gradation** (*katu → kadulla*, *pankki → pankissa*)
- The gap between **kirjakieli** (textbook) and **puhekieli** (what people actually say: *minä olen → mä oon*)
- Real life in Finland: K-Market checkouts, Föli buses, Kela, the YKI exam

Suomeksi teaches the course *and* drills those pain points directly.

## Features (v0.2)

| | Feature | Inspired by |
|---|---|---|
| 🛤️ | Learning path with units, locked progression, crowns | Duolingo |
| ✨ | New-word intro cards with audio before quizzing | LingoDeer |
| 🧩 | 18 exercise types: intro, multiple choice, picture cards (both ways), match pairs, word-bank translation (both ways), listen-and-build, typing, spelling tiles, fill-in-the-blank, cross out the extra word, multi-turn conversation, odd one out, ending detective, pick the right form, street Finnish, true or false, long-or-short listening | Duolingo, LingoDeer + *originals* |
| 🔁 | Missed exercises come back at the end of the lesson | Duolingo |
| ❤️ | Hearts that refill over time (or by reviewing) · XP · daily goal · streaks | Duolingo |
| 🧠 | Flashcard review scheduled with **FSRS** (the modern Anki algorithm) | LingoDeer / Anki |
| 📘 | Grammar "learning tips" per unit with tables and spoken examples | LingoDeer |
| 📖 | Dialogue stories with tap-to-translate lines and comprehension questions | Duolingo Stories |
| 🏛️ | **Case gym** — any noun × any of 10 cases | *Suomeksi original* |
| 🔁 | **Verb gym** in kirjakieli *or* puhekieli | *Suomeksi original* |
| 🗣️ | **Puhekieli toggle** — spoken variant shown next to every sentence | *Suomeksi original* |
| ⌨️ | Forgiving answer checker: contractions, typos, missing ä/ö (with a nudge) | — |
| 🏆 | Achievements, stats, settings, unlimited-hearts and unlock-all modes | Duolingo |
| 🔊 | Neural voice clips for every item, with device-voice fallback | — |
| 🎭 | **A cast of ten characters** (a seal pup, a lumberjack, a metalhead, a grandma…) with expressions, personal name tags and their own voices | *Suomeksi original* |
| 🎧 | **Four-skills hub**: listening with the text hidden, reading, writing tasks with a score, and shadowing for speaking | *Suomeksi original* |
| 👆 | Tap or hover any word in a sentence for its meaning | LingQ-style |
| ✂️ | **Sentence breakdowns**: tap any sentence apart into stems and endings, with an explanation for every word | *Suomeksi original* |
| 🗺️ | **Journey map** from A1.1 to C2, mapped to YKI levels, with can-do goals and grammar per stage | *Suomeksi original* |
| 🎓 | **Study guide**: eleven research-backed tips, each with sources | *Suomeksi original* |
| 🇫🇮 | **Culture notes** attached to units: sauna, sisu, coffee, Turku, everyman's rights | *Suomeksi original* |
| 🔞 | **18+ pack** behind a toggle: bar talk, swearing, dating | *Suomeksi original* |
| 🎨 | **Kaamos Ink** visual style: comic-ink panels, hard shadows, halftone, slanted type | *Suomeksi original* |

**Course content:** 4 A1 units + 2 units on the 18+ track · 21 lessons · 152 words · 116 sentences · 17 grammar notes · 2 stories · 5 conversations · 3 writing tasks · 232 lexicon word forms · 12 culture notes · 7 life-in-Finland notes · 11 study tips · 14 gym nouns · 12 gym verbs.
All content is AI-drafted and marked `"reviewed": false` until a native speaker signs it off (see [docs/CONTENT.md](docs/CONTENT.md)).

## Quick start

```bash
npm install
npx expo install --fix     # aligns native package versions with your Expo SDK
npm run web                # or: npm run android / npm run ios (Expo Go)
```

Regenerate the audio after changing content (clips for the current content are already in `assets/audio/`). Needs Python 3.8+:

```bash
pip install edge-tts
npm run audio              # writes assets/audio/* and src/audio/manifest.ts
```

`edge-tts` is free but unofficial; see the note at the top of `scripts/generate_audio.py`. For a fully open, offline alternative with a single voice, use `python scripts/generate_audio.py --engine piper`.

Check content before committing:

```bash
npm run validate           # ids, fill-ins, stories, audio coverage
npm run typecheck
```

## Project structure

```
app/                     expo-router screens
  (tabs)/                Learn path · Review · Practice · Guide · Profile
  journey.tsx            A1.1 → C2 journey map
  tip/[id].tsx           study tip · culture/[id].tsx culture note · cast.tsx characters
  lesson/[id].tsx        lesson player (queue, hearts, feedback, re-queue)
  grammar/[id].tsx       grammar tips
  story/[id].tsx         stories + comprehension
  gym/cases.tsx          case gym
  gym/verbs.tsx          verb gym
src/
  content/               course data as JSON (units, stories, gym, lexicon, characters,
                         curriculum, guide, culture, sets) + typed loaders
  theme.ts               "Kaamos Ink" design tokens
  engine/                exercise generator, answer checker, FSRS, achievements
  state/store.ts         zustand store persisted to AsyncStorage / localStorage
  audio/                 Piper clip manifest + TTS fallback
  components/            UI kit, character art, sentence breakdown, one component per exercise type
scripts/                 audio generation, content validation, open-data importers
docs/                    roadmap, sprint reviews, content guide
```

Content is plain JSON on purpose: reviewers can fix a sentence in a GitHub PR without touching code, and Python scripts can read it directly.

## Roadmap — 12 sprints

Run as a solo Scrum project, rotating through four roles each sprint: **Scrum Lead · Content Quality · Documentation · Tech Lead**. Every sprint ends with a review in [`docs/sprints/`](docs/sprints/).

| # | Sprint | Goal | Status |
|---|---|---|---|
| 1 | **Foundations** | Universal Expo app, learning engine, FSRS, 4 A1 units | ✅ [Review](docs/sprints/sprint-01-foundations.md) |
| 2 | **Voice and identity** | Audio for all 381 items, character cast, own visual style, breakdowns, journey map, study guide, culture, 18+ pack | ✅ [Review](docs/sprints/sprint-02-voice-and-identity.md) |
| 3 | **Native review** | Native-speaker review of units 1–4, review workflow, error log | ⏳ Next |
| 4 | **Open data** | kaikki.org + Tatoeba pipelines, gym grows to 200+ nouns and 100+ verbs | 🗓️ |
| 5 | **A1 complete** | Units 5–10: time, family, home, weather, health, work | 🗓️ |
| 6 | **Accounts & sync** | Supabase auth, offline-first cloud sync of progress | 🗓️ |
| 7 | **Social** | Weekly leagues, friends, friend streaks | 🗓️ |
| 8 | **Learning science** | Mistake-driven practice, adaptive difficulty, FSRS tuned on real review logs | 🗓️ |
| 9 | **Speaking** | Pronunciation practice and shadowing with speech recognition | 🗓️ |
| 10 | **Life in Finland** | YKI exam practice, Kela / doctor / bank dialogues, puhekieli stories | 🗓️ |
| 11 | **Mobile release** | EAS builds, Play Store internal testing, PWA install, reminders | 🗓️ |
| 12 | **Launch & insights** | Retention dashboard (D1/D7/D30), A/B tests, public beta | 🗓️ |

Full feature comparison and backlog: [docs/ROADMAP.md](docs/ROADMAP.md).

## Data sources & credits

See [ATTRIBUTION.md](ATTRIBUTION.md). Open data (Wiktionary via kaikki.org, Tatoeba) is only used through the review pipeline in `scripts/`, never shipped unchecked.

---

Built in Turku by [Frank Ponce](https://frankponce.dev) · Not affiliated with Duolingo or LingoDeer.
