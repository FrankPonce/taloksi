# Roadmap & feature matrix

Legend: ✅ shipped · 🟡 partial · 🗓️ planned (sprint #) · — not planned

## Feature matrix

| Feature | Duolingo | LingoDeer | Suomeksi |
|---|:-:|:-:|:-:|
| Learning path / units | ✅ | ✅ | ✅ |
| New-word intro cards | 🟡 | ✅ | ✅ |
| Multiple choice, match, word bank, listen, type | ✅ | ✅ | ✅ |
| Fill-in-the-blank grammar drills | ✅ | ✅ | ✅ |
| Grammar explanations per unit | 🟡 | ✅ | ✅ |
| Hearts / lives | ✅ | — | ✅ |
| XP, daily goal, streak | ✅ | 🟡 | ✅ |
| Streak freeze | ✅ | — | 🗓️ 7 |
| Spaced-repetition flashcards | 🟡 | ✅ | ✅ (FSRS) |
| Mistakes review | ✅ | ✅ | 🟡 in-lesson re-queue → 🗓️ 8 |
| Stories / dialogues | ✅ | ✅ | ✅ |
| Achievements | ✅ | 🟡 | ✅ |
| Native-quality audio | ✅ | ✅ | 🟡 neural TTS, 7 character voices |
| Slow audio | ✅ | ✅ | ✅ |
| Speaking exercises | ✅ | ✅ | 🗓️ 9 |
| Offline mode | 🟡 | ✅ | ✅ (all local) |
| Accounts & cloud sync | ✅ | ✅ | 🗓️ 6 |
| Leagues / leaderboards | ✅ | — | 🗓️ 7 |
| Friends & friend quests | ✅ | — | 🗓️ 7 |
| Push reminders | ✅ | ✅ | 🗓️ 11 |
| AI explanations / roleplay | ✅ (paid) | — | backlog |
| Case gym (noun × case) | — | — | ✅ |
| Verb gym with puhekieli | — | — | ✅ |
| Kirjakieli ↔ puhekieli toggle | — | — | ✅ |
| Consonant-gradation hints | — | — | ✅ |
| YKI exam practice | — | — | 🗓️ 10 |
| Finland-life scenarios (Kela, Föli, K-Market) | — | — | 🟡 → 🗓️ 10 |
| Character cast with distinct voices | ✅ | — | ✅ |
| Word-by-word sentence breakdowns | — | — | ✅ |
| Journey map A1 → C2 (CEFR + YKI) | 🟡 | — | ✅ (A1.1 has lessons) |
| Sourced study guide | — | — | ✅ |
| Culture notes | — | 🟡 | ✅ |
| 18+ everyday language pack | — | — | ✅ |

## Sprint plan

Each sprint is ~2 weeks part-time. Roles rotate every sprint: **Scrum Lead** (scope & board), **Content Quality** (accuracy, review log), **Documentation** (README, sprint review), **Tech Lead** (architecture & code review).

| # | Sprint | Deliverables | Done when |
|---|---|---|---|
| 1 | Foundations | Expo universal app; exercise engine; FSRS; store; 4 units; gyms; stories; validator | App runs on web + Expo Go, validator passes |
| 2 | Voice | Piper clips for every word/sentence/story line; puhekieli clips; mp3 compression; audio QA list | `validate` reports 100 % audio coverage |
| 3 | Native review | 2+ native reviewers; review checklist; `reviewed: true` on units 1–4; error log by category | Errors per 100 sentences tracked and < 2 |
| 4 | Open data | kaikki.org noun + verb tables; Tatoeba candidate pipeline; 200+ gym nouns, 100+ verbs | Spot-check ≥ 95 % correct |
| 5 | A1 complete | Units 5–10, 2 stories per unit, grammar notes | ~600 words, all reviewed |
| 6 | Accounts & sync | Supabase auth, progress sync, conflict handling | Progress survives reinstall / device switch |
| 7 | Social | Weekly leagues, friends list, friend streaks, streak freeze | 10 testers in one league |
| 8 | Learning science | Personal mistake bank, adaptive exercise mix, FSRS parameters fitted on review logs | Retention measured vs. default parameters |
| 9 | Speaking | Speak-the-sentence exercise (Web Speech API / on-device ASR), shadowing mode | Works on web + Android |
| 10 | Life in Finland | YKI-style tasks, real-life dialogues, puhekieli story series | 10 scenario lessons |
| 11 | Mobile release | EAS builds, Play internal testing, PWA manifest, notifications | Installable on Android + as PWA |
| 12 | Launch & insights | Retention dashboard (D1/D7/D30), lesson funnel, A/B test of lesson length, public beta | Write-up of first-month learnings |

## Backlog (unscheduled)

- AI "explain my mistake" (cached or on-device, to stay free)
- Swedish-speaker track for bilingual Turku / Åbo learners
- Dark mode
- Custom flashcard decks
- Teacher dashboard for university Finnish courses
