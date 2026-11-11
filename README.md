<div align="center">

# 🦭 Suomeksi

**Learn Finnish the way it's actually spoken.**
A free Duolingo / LingoDeer-style app built *only* for Finnish: cases, consonant gradation and puhekieli included.

Expo (React Native) · TypeScript · FSRS spaced repetition · character voices · Web + iOS + Android from one codebase

[Roadmap](docs/ROADMAP.md) · [Handoff notes](HANDOFF.md) · [Content guide](docs/CONTENT.md)

</div>

---

## Contents

1. [Status and progress](#status-and-progress)
2. [Goalposts](#goalposts)
3. [Why another language app?](#why-another-language-app)
4. [What is in it today](#what-is-in-it-today)
5. [Quick start](#quick-start)
6. [Project structure](#project-structure)
7. [Sprint plan](#sprint-plan)
8. [Contributing](#contributing)
9. [Licence and credits](#licence-and-credits)

## Status and progress

**v0.2, playable on web.** Sprint 3 of 11. All course content is written by AI and checked by AI; no native speaker has read it.

```
Sprints done            ████░░░░░░░░░░░░░░░░   2 / 11
Course to B1 (units)    ██░░░░░░░░░░░░░░░░░░   4 / 33
A1 units                ███████░░░░░░░░░░░░░   4 / 11
Units with review pass  ░░░░░░░░░░░░░░░░░░░░   0 / 6
Characters with lessons ████████████░░░░░░░░  10 / 17
Skill rooms with grading░░░░░░░░░░░░░░░░░░░░   0 / 4
```

| Platform | State |
|---|---|
| Web | ✅ Runs and has been clicked through |
| Android | ⬜ Not tested yet |
| iOS | ⬜ Not tested yet |

The bars are updated by hand when a sprint closes. The unit totals count the planned starter unit (unit 0) and units 1 to 32.

## Goalposts

The project is done in this order. Each goalpost has one test that says whether it has been reached.

| | Goalpost | Reached when | State |
|---|---|---|---|
| 1 | **Playable prototype** | A full lesson can be played start to finish on web | ✅ |
| 2 | **Its own identity** | Own visual style, a cast, a voice for every line | ✅ |
| 3 | **A proper beginning** | Unit 0 (letters, sounds, sentence structure) exists, no lesson uses grammar before explaining it, and units 1–4 have had a review pass | ⏳ current |
| 4 | **A1 complete** | Units 0–10, each with a checkpoint test and a story | ⬜ |
| 5 | **On your phone** | Installable on Android and as a web app, with progress synced to an account | ⬜ |
| 6 | **Four real skills** | Listening, reading, writing and speaking each have graded tasks | ⬜ |
| 7 | **Public beta** | Open to anyone, with retention numbers being collected | ⬜ |
| 8 | **A2, then B1** | The course reaches YKI level 3 | ⬜ after launch |

What each of these involves, and the decisions still open, is in [docs/ROADMAP.md](docs/ROADMAP.md).

## Why another language app?

Generic apps treat Finnish like any other language. Learners struggle with the things that make Finnish *Finnish*:

- **15 grammatical cases** and **consonant gradation** (*katu → kadulla*, *pankki → pankissa*)
- The gap between **kirjakieli** (textbook) and **puhekieli** (what people actually say: *minä olen → mä oon*)
- Real life in Finland: K-Market checkouts, Föli buses, Kela, the YKI exam

Suomeksi teaches the course *and* drills those pain points directly.

## What is in it today

### Learning

| Feature | From |
|---|---|
| Learning path with units and locked progression | Duolingo |
| New-word cards with a picture, word type and audio before any quiz | LingoDeer |
| 18 exercise types, generated from each lesson's content: multiple choice, picture cards, match pairs, word-bank translation both ways, listen-and-build, typing, spelling tiles, fill-in, cross out the extra word, multi-turn conversation, odd one out, true or false, and the Finnish-specific ones below | Duolingo, LingoDeer, own |
| Missed exercises come back at the end of the lesson | Duolingo |
| Flashcard review scheduled with FSRS | Anki |
| Forgiving answer checker: contractions, typos, missing ä/ö with a nudge | own |
| Hearts, XP, daily goal, streaks, achievements | Duolingo |

### Built for Finnish

| Feature | What it does |
|---|---|
| **Puhekieli on every sentence** | The spoken form sits next to the textbook form, with its own audio |
| **Sentence breakdowns** | Any sentence taken apart into stems and endings, with a reason for each |
| **Ending detective, pick the right form, street Finnish, long-or-short** | Exercises for cases, registers and vowel length |
| **Case gym and verb gym** | Any noun in any of 10 cases; verbs in textbook or spoken Finnish |
| **Tap any word** | A quick translation for every word in a Finnish sentence |
| **Journey map** | A1.1 to C2, mapped to YKI levels, with can-do goals per stage |

### The cast

Seventeen characters drawn in code, each with a build, a pose, six expressions, a signature prop, a name tag and a voice. One character hosts each lesson, presents every exercise and reacts to your answers.

Norppa the seal pup · Sofia the exchange student · Pekka the lumberjack · Aino the barista · Helvi the grandma · Mikko the bus driver · Samir the engineer · Jere the metalhead · Joonas the hockey fan · Joulupukki · Aada the pop-punk singer · Linh the quantum physicist · Tuuli the nurse · and on the 18+ track Niko, Leo, Ronja and Veera.

### Around the course

| Feature | What it does |
|---|---|
| **Four-skills hub** | Listening with the text hidden, reading, writing tasks with a score, shadowing for speaking |
| **Stories and conversations** | Dialogue stories with questions; four-turn conversations inside lessons |
| **Finland in the course** | Facts inside sentences, 12 culture notes, 7 practical notes on living here |
| **Study guide** | Eleven tips on how to learn, each with sources |
| **18+ track** | Behind a setting: bar talk, swearing, dating, parties, with its own characters |
| **Kaamos Ink** | The visual style: comic-ink panels, hard shadows, halftone, slanted type |

### Content in numbers

4 A1 units and 2 units on the 18+ track · 21 lessons · 152 words · 116 sentences · 17 grammar notes · 2 stories · 5 conversations · 3 writing tasks · 451 audio clips · 14 gym nouns · 12 gym verbs.

A unit is marked `"reviewed": true` once it has had a review pass by Claude against the checklist in [docs/CONTENT.md](docs/CONTENT.md). That pass is not a native speaker's check, and the app says so.

## Quick start

```bash
git clone https://github.com/FrankPonce/suomeksi.git
cd suomeksi
npm install
npx expo install --fix     # aligns native package versions with your Expo SDK
npm run web                # or: npm run android / npm run ios (Expo Go)
```

Check your work before committing:

```bash
npm run validate           # ids, hosts, speakers, fill-ins, stories, audio coverage
npm run typecheck
```

Regenerate audio after changing content. The clips for the current content are already in `assets/audio/`.

```bash
pip install edge-tts
npm run audio              # writes assets/audio/* and src/audio/manifest.ts
```

`edge-tts` is free but unofficial; see the note at the top of `scripts/generate_audio.py`. For an open, offline alternative with a single voice, run `python scripts/generate_audio.py --engine piper`.

## Project structure

```
app/                     expo-router screens
  (tabs)/                Learn path · Review · Practice · Guide · Profile
  lesson/[id].tsx        lesson player (queue, hearts, feedback, re-queue)
  grammar/ story/ write/ grammar notes, stories, writing tasks
  gym/                   case gym, verb gym
  journey.tsx  cast.tsx  journey map, the characters
src/
  content/               course data as JSON (units, lexicon, characters, stories,
                         dialogues, curriculum, guide, culture) + typed loaders
  engine/                exercise generator, answer checker, FSRS, achievements
  components/            UI kit, character art, sentence breakdown, one component per exercise
  state/store.ts         progress, saved on the device
  audio/                 clip manifest + device text-to-speech fallback
  theme.ts               design tokens
scripts/                 audio generation, content validation, open-data importers
docs/                    roadmap, sprint reviews, content guide
```

Content is plain JSON on purpose: a reviewer can fix a sentence in a pull request without touching code, and the Python scripts can read it directly.

## Sprint plan

Run as a solo Scrum project, rotating through four roles each sprint: Scrum Lead, Content Quality, Documentation, Tech Lead. Every sprint ends with a review in [`docs/sprints/`](docs/sprints/).

| # | Sprint | Goal | Status |
|---|---|---|---|
| 1 | **Foundations** | App, learning engine, FSRS, 4 A1 units | ✅ [Review](docs/sprints/sprint-01-foundations.md) |
| 2 | **Voice and identity** | Audio for every item, the cast, own visual style, breakdowns, journey map, 18+ pack | ✅ [Review](docs/sprints/sprint-02-voice-and-identity.md) |
| 3 | **Starter and structure** | Unit 0, concept cards, no grammar before its explanation, review pass on units 1–4, open-data word lists | ⏳ Current |
| 4 | **A1 complete** | Units 5–10, checkpoints, placement check, a story per unit | ⬜ |
| 5 | **Accounts and sync** | Sign-in and progress sync | ⬜ |
| 6 | **Social** | Leagues, friends, streak freeze | ⬜ |
| 7 | **Learning science** | Mistake bank, typed review, gradation and partitive drills | ⬜ |
| 8 | **Skill rooms** | Graded listening, reading, writing and speaking | ⬜ |
| 9 | **Life in Finland** | Scenario lessons, YKI practice, more 18+ units | ⬜ |
| 10 | **Mobile release** | Android build, installable web app, reminders | ⬜ |
| 11 | **Launch** | Public beta and retention numbers | ⬜ |

## Contributing

If you speak Finnish natively, reading the course is the most useful thing you can do: nobody has yet. Content is plain JSON in `src/content/`, so a correction is a one-line pull request; the checklist is in [docs/CONTENT.md](docs/CONTENT.md). Run `npm run validate` and `npm run typecheck` before opening one.

## Licence and credits

No licence has been chosen yet, so for now all rights are reserved. This is an open decision in the roadmap.

Data sources are credited in [ATTRIBUTION.md](ATTRIBUTION.md). Open data (Wiktionary via kaikki.org, Tatoeba) only enters the course through the review pipeline in `scripts/`.

---

Built in Turku by [Frank Ponce](https://frankponce.dev) · Not affiliated with Duolingo or LingoDeer.
