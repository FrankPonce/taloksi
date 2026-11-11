# Suomeksi — Handoff

Everything a new contributor (human or Claude Code) needs to pick this project up cold.

## 1. The idea

**Suomeksi** ("in Finnish") is a free, open-source Duolingo / LingoDeer-style app built **only for Finnish**.

Generic language apps handle Finnish poorly where learners struggle most:

- **Cases and consonant gradation.** Finnish has 15 cases, and stems change (*katu → kadulla*, *pankki → pankissa*). Generic apps only teach these implicitly through translation.
- **Kirjakieli vs puhekieli.** Textbook Finnish (*minä olen*) differs a lot from what people actually say (*mä oon*). Learners arrive in Finland and can't follow conversations.
- **Life in Finland.** K-Market checkouts ("Tarviiks kassin?"), Föli buses, Kela, the YKI language exam.

The plan is to copy the proven mechanics from Duolingo and LingoDeer, then add Finnish-specific tools on top:

| From Duolingo | From LingoDeer | Suomeksi originals |
|---|---|---|
| Learning path, hearts, XP, streaks, daily goal, leagues (planned), stories, re-queued mistakes, characters | New-word intro cards, grammar "learning tips", flashcard review, strong audio | Sentence breakdowns, ending detective, street-Finnish exercise, long-or-short listening, case gym, verb gym, puhekieli on every sentence, journey map to C2, sourced study guide, culture notes, 18+ pack |

**Audience:** international students and newcomers in Finland, starting with Turku (where the author lives and studies).

**Constraints:** zero budget. Free tiers only (Expo, Vercel/Cloudflare, Supabase later), free TTS, open data (Wiktionary via kaikki.org, Tatoeba). The only unavoidable costs are app-store fees: Google Play $25 once, Apple $99/yr, and Apple can be deferred.

**Author:** Frank Ponce (frankponce.dev), CS grad, data science master's student (EDISS, Åbo Akademi). The README and roadmap are meant to look good as a portfolio piece. The format mirrors the CadetX project: 12 numbered sprints, rotating Scrum roles, and a review file per sprint.

## 2. Current state (end of Sprint 2)

**It builds and runs on web.** `npm run typecheck` is clean, `npm run validate` reports 0 errors, and every screen and a full lesson have been clicked through in the browser. It has **not** been run on a phone yet.

**Run it:**

```bash
npm install
npm run web
```

**Content:** 4 A1 units plus 2 units on the 18+ track, 21 lessons, 152 words (130 with a picture), 116 sentences, 17 grammar notes, 2 stories, 5 conversations, 3 writing tasks, 232 lexicon word forms, 12 culture notes, 7 life-in-Finland notes, 11 study tips, 11 journey stages, 10 characters, 444 audio clips.

**All content is AI-drafted and unreviewed** (`"reviewed": false` on every unit). That includes the lexicon explanations, culture notes and the 18+ pack. Treat the Finnish as good but unverified. A native-speaker review is Sprint 3.

**First tasks for whoever picks this up:**

1. `git init` and make the first commit. There is still no git history.
2. Run it in Expo Go on Android and iOS. The style uses `boxShadow` and `skewX`, which need the new architecture on Android.
3. Decide the voice licence question (see "Known gaps").
4. Start Sprint 3: native review.

### Added after the Sprint 2 review (Sprint 3 work in progress)

- **Cast rebuilt.** Ten characters with personalities, outfits, four expressions (happy, excited, puzzled, sad) and a personal name-tag style each: Norppa (white seal pup, the mascot), Sofia (exchange student; was "Sofia"), Pekka (lumberjack), Aino (barista), Helvi (grandma), Mikko (bus driver), Samir (engineer), Jere (metalhead), and on the 18+ track Niko and Leo. Units have a `host` character and a `scene` backdrop.
- **Words** carry a type (`pos`) and most a picture (`icon`, a MaterialCommunityIcons name).
- **18 exercise types.** New: picture cards (both ways), cross out the extra word, spell from letter tiles, pick the right form, and multi-turn conversations (`dialogues.json`). Four of the six "special" sentence exercises are drawn per session, so replays differ. Lessons average about 32 steps, which is long; trimming is an open question.
- **Tap or hover any word** of a Finnish prompt for a quick translation (`Glossed` in `ui.tsx`).
- **Finland facts.** A sentence can carry a `fact`, shown as "Tiesitkö?" in the feedback.
- **Four-skills hub** on the practice tab: listening (stories with the text hidden), reading, writing, speaking (shadowing), plus grammar.
- **Writing tasks** (`writing.json`, `/write/[id]`) are scored 0–5 by an offline checker in `engine/writing.ts`. It only looks for the requested points by keyword and a few mechanical slips. **It does not understand Finnish and is not AI.** A real AI grader is not built: it needs a decision on provider and on where the API key lives.
- **Speaking** is self-graded shadowing. The app does not listen.
- **Motion and sound.** `components/motion.tsx` (pop, rise, shake, bob, flip; respects reduced motion) and synthesised effects in `assets/sfx/` behind a setting.
- **Not re-verified in the browser:** the last batch (conversations, writing, four-skills hub, backdrops, second 18+ unit) typechecks and the lesson engine was exercised in Node over every lesson, but the screens were not clicked through because the preview window was not painting.

## 3. Architecture

```
app/                      expo-router screens
  _layout.tsx             root stack, loads fonts
  (tabs)/                 index (learn path) · review · practice · guide · profile
  lesson/[id].tsx         lesson player: queue, hearts, feedback, breakdown, re-queue, summary
  grammar/[id].tsx        grammar note renderer (p / tip / example / table blocks)
  story/[id].tsx          dialogue story + comprehension questions
  gym/cases.tsx           noun × case drill
  gym/verbs.tsx           conjugation drill, kirjakieli or puhekieli
  journey.tsx             A1.1 → C2 journey map
  tip/[id].tsx            study tip with sources
  culture/[id].tsx        culture note
  cast.tsx                the characters
src/
  theme.ts                "Kaamos Ink" design tokens
  content/                ALL course data as JSON + typed loaders (index.ts, types.ts)
    units/unit1-4.json    main course: lessons (words, sentences, fill-ins) + grammar notes
    units/unitx1.json     18+ bonus unit ("track": "adult")
    lexicon.json          every word form used in a sentence: lemma, meaning, stem|ending split, explanation, tag
    characters.json       the cast: bio, portrait parameters, voice settings
    curriculum.json       journey stages A1.1 → C2
    guide.json            study tips with sources
    culture.json          culture notes
    sets.json             word categories (odd one out) and sound-alike word sets
    stories.json, gym.json
  engine/
    exercises.ts          generates a lesson's exercise queue from content
    text.ts               normalize / tokenize / checkAnswer (contractions, typos, ä/ö leniency)
    srs.ts                FSRS via ts-fsrs (revive dates from storage, dueIds)
    achievements.ts       achievement definitions + checks
    random.ts, dates.ts
  state/store.ts          zustand + persist (AsyncStorage on native, localStorage on web)
  audio/                  speak(): clip if present in manifest.ts, else expo-speech fi-FI shaped per character
  components/
    ui.tsx                the kit: Screen, Panel, Button, Chip, Tag, H1, ProgressBar, SpeakerButton, Verdict…
    Text.tsx              app text: maps weight to font file, picks ink or paper by surface
    art.tsx               Avatar, Norppa, Speech bubble (all SVG drawn in code)
    Breakdown.tsx         sentence taken apart word by word
    exercises/            one component per exercise type
scripts/                  Python: generate_audio, validate_content, import_kaikki, import_tatoeba
docs/                     ROADMAP.md, CONTENT.md, sprints/
metro.config.js           makes Metro pick CommonJS builds (zustand's ESM build breaks the web bundle)
```

### Key design decisions

- **Content is JSON, not TS.** Python scripts can read it, and native reviewers can edit it in GitHub PRs without touching code.
- **Lessons are generated, not hand-authored.** `buildLessonExercises()` turns each lesson's words and sentences into a queue:
  1. warm-up: two words from earlier lessons (spaced retrieval)
  2. intro cards and pick-the-word, two words at a time
  3. match pairs, then odd one out
  4. sentence exercises rotating through build fi→en, build en→fi and listen, with one each of ending detective, street Finnish, true or false and long-or-short slotted in between
  5. one typing task
  6. the fill-ins

  Adding a lesson means adding JSON only.
- **Breakdowns come from one lexicon.** `breakdown(sentence)` looks each word up in `lexicon.json`. The validator fails if a sentence uses a word that is not there, so new sentences need new lexicon entries. The `tag` (ine, ela, ill, ade, all, par, p1–p6, q) drives the ending-detective exercise.
- **Every sentence has a speaker.** `"speaker"` on sentences and `"speakerId"` on story lines point at `characters.json`. The app shows that character's portrait and the audio script uses that character's voice.
- **Mistakes are re-queued** once (key suffix `-r`).
- **SRS:** finishing a lesson seeds FSRS cards for all its words and sentences. The Review tab grades Again / Hard / Good / Easy. A review session of 5+ cards refills a heart.
- **Audio IDs = content IDs.** Puhekieli clips use `<id>__puhe` (always Aino's voice), sound-alike words `mp_<word>`, character intros `cast_<id>`. Don't rename IDs once audio exists. After changing content run `npm run audio` (needs Python 3.8+ and `pip install edge-tts`).
- **Tracks.** A unit with `"track": "adult"` is hidden unless the 18+ setting is on, unlocks independently of the main path, and its words never appear as wrong answers in main-course exercises.
- **Bilingual UI:** labels are written "Suomi · English" on purpose, for passive exposure.

### Visual style: "Kaamos Ink"

Comic-ink panels on a polar-night background. The rules, so new screens match:

- Background is `colors.night`. Content sits on paper-coloured `Panel`s with a 3px ink outline and a hard offset shadow (`hardShadow()`), never a blurred one.
- Headings and buttons use the slanted condensed display face. Labels are `Tag`s: a solid bar, slightly rotated.
- Accent colours are flat and saturated: blue, aurora green, red, gold, berry, orange. No gradients.
- Small rotations (1–6°) on labels, badges and some panels. Halftone dots (`Halftone`) on hero panels.
- Icons are Ionicons. Characters and the mascot are SVG in `art.tsx`. No emoji in the UI.
- Use `Text` from `components/ui`, not from `react-native`, so fonts and colours stay consistent.

No Duolingo, LingoDeer or other third-party branding or assets.

### Known gaps and risks

- **Voice licence.** The shipped clips are generated with `edge-tts` (Microsoft Edge's read-aloud voices Noora and Harri, pitched per character). It is free and sounds natural, but it is not an official API and the terms for redistributing the audio are unclear. Before a public release either confirm the terms, switch to Piper (`--engine piper`: open and offline, but one voice), or record real speakers.
- Only verified on web. Phone testing is still to do.
- Content is unreviewed (see above). Journey stages after A1.1 are a plan with no lessons yet.
- The hour and word-count figures on the journey map are rough planning numbers, labelled as such in the app.
- No accounts, sync, leagues or speaking exercises yet. These are in the roadmap.
- No app icon or splash screen yet; Expo defaults are used.
- `npm audit` reports vulnerabilities in transitive dev dependencies; not looked at.

## 4. Roadmap

Full table in `docs/ROADMAP.md`. Sprint reviews go in `docs/sprints/sprint-NN-name.md` (template: `_TEMPLATE.md`).

1. ✅ Foundations
2. ✅ Voice and identity
3. ⏳ **Native review** (next)
4. Open data (kaikki.org, Tatoeba)
5. Units 5–10 (A1 complete)
6. Supabase accounts and sync
7. Leagues and friends
8. Learning science (mistake bank, FSRS tuning)
9. Speaking
10. Life in Finland / YKI
11. Mobile release (EAS, Play Store, PWA)
12. Launch and retention analytics

Roles rotate every sprint: **Scrum Lead · Content Quality · Documentation · Tech Lead**. Update the README's sprint table and write a sprint review when a sprint closes.

## 5. Conventions

- IDs: `w_<word>`, `s_<lesson>_<n>`, `f_<lesson>_<n>`, `g_<topic>`, `st_<story>_<n>`, `c_<topic>` (culture), `t_<topic>` (study tip). They must be unique across the course.
- Run `npm run validate` before committing content. It checks ids, speakers, lexicon coverage, categories, stage and culture links, and audio coverage.
- Every study tip needs at least one linked source. Paraphrase, don't copy.
- Open data goes through `scripts/` into `data/` for review. It never ships to `src/content/` unchecked. Credit sources in `ATTRIBUTION.md` (Wiktionary is CC BY-SA, Tatoeba is CC BY 2.0 FR).
- Writing rules and the native-review checklist are in `docs/CONTENT.md`.
