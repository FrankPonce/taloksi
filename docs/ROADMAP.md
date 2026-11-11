# Suomeksi roadmap

What the app is meant to be when it is finished, what exists today, and the order things get built in. This is a working document: the "Open decisions" section at the end is where to argue.

Legend: ✅ shipped · 🟡 partly there · 🗓️ planned (sprint number) · ❌ decided against

## 1. The finished app in one paragraph

A complete Finnish course from zero to working fluency, for people who live in Finland or are about to. One main path teaches the language in the order you need it, hosted by a cast of characters who each own a part of Finnish life. Around the path sit four skill rooms (listening, reading, writing, speaking), two gyms for the grammar that makes Finnish hard (cases and verbs), and a guide to living here. Every sentence comes in textbook Finnish and in the Finnish people actually say. It is free, works offline, and has nothing in it that is not there to teach.

## 2. Principles

These decide what gets in.

1. **Complete, not cluttered.** Everything a learner needs to reach B1 and pass YKI is in the app. Anything that is merely nice is left out. Importing your own articles, videos or podcasts (the LingQ idea) is out for that reason: a lot of surface for a small gain.
2. **Useful words first.** New vocabulary is ordered by how often it is used in real Finnish, with a short on-ramp of survival basics before frequency takes over.
3. **Recall beats recognition.** Tapping the right tile is the easy start of a lesson. By the end of it the learner types, spells and builds from nothing.
4. **Spoken Finnish is not an extra.** Puhekieli is on every sentence from lesson one.
5. **Finland is part of the course.** Sentences teach facts about the country, units carry culture notes, and a whole track covers the practical side of moving here.
6. **One new idea at a time.** A word is met in its plain dictionary form first. A new ending or rule is never used before it has been introduced, and the first time it appears the lesson stops to explain it.
7. **Characters carry the course.** One character hosts each lesson, units mix hosts, and each character has topics that are theirs.
8. **Zero budget.** Free tiers, open data, open-source tools.

## 3. Where it stands against other Finnish apps

| | Duolingo | Speakly | WordDive | LingQ | Suomeksi now | Suomeksi finished |
|---|---|---|---|---|---|---|
| Core method | Gamified translation drills | High-frequency phrases | Typed active recall | Reading and listening input | Generated lessons, 18 exercise types, FSRS review | Same, with frequency-ordered vocabulary and more typing |
| Spoken Finnish (puhekieli) | Very little | In dialogues | Separate courses | Whatever you import | ✅ On every sentence | ✅ Plus puhekieli-only stories |
| Grammar help | Sparse tips | Reference guide | Inside examples | None | ✅ Notes per unit, sentence breakdowns, case and verb gyms | ✅ Plus a searchable grammar reference |
| The four skills | Mixed into lessons | Listening and speaking situations | Spelling and speaking | Reading and listening | 🟡 Hub exists; writing and speaking are self-checked | ✅ A room per skill, each with graded tasks |
| Content shape | Fixed path | Fixed levels | Topic packs | Bring your own | ✅ Fixed path plus an 18+ track | ✅ Path to B1, 18+ track, life-in-Finland track |
| Life in Finland | None | None | None | None | 🟡 7 life notes, 12 culture notes | ✅ Kela, bank, doctor, housing, work, YKI |

What is taken from each: Speakly's frequency ordering and situation dialogues, WordDive's insistence on typing, and from LingQ only the tap-any-word gloss, which is already in.

## 4. The parts of the finished app

### The main path

| Stage | CEFR | Units | Status |
|---|---|---|---|
| Starter | pre-A1 | 0: letters and sounds, how a Finnish sentence works | 🗓️ 4, see section 5 |
| Survival basics | A1.1 | 1–4: greetings, origins, shop and café, the city | ✅ 16 lessons, unreviewed; to be re-ordered to follow the first-contact rule |
| Everyday life | A1.2–A1.3 | 5–10: time, family, home, weather, health, work | 🗓️ 5 |
| Getting by | A2 | 11–20 | 🗓️ after launch |
| Independent | B1 (YKI 3) | 21–32 | 🗓️ after launch |

A1 and A2 are the launch target. B1 is the level the citizenship language requirement asks for, so it is where the course is meant to end up.

### The four skill rooms

| Room | Today | Finished |
|---|---|---|
| **Listening** | Stories with the text hidden, long-or-short sound drill | A clip, then questions about what was said. Normal and slow speed. Puhekieli clips from A2. |
| **Reading** | Stories with tap-to-translate | Graded texts per stage: signs, messages, short news, forms. Questions after each. |
| **Writing** | 3 prompts, scored by a keyword checker that does not understand Finnish | Prompts per stage ("introduce yourself: age, where you are from, your job, a hobby, your favourite colour") graded by an AI with a mark out of 5 and corrections line by line. See open decision 1. |
| **Speaking** | Shadowing, self-graded | Say-the-sentence with speech recognition, then role-play with a character. 🗓️ 9 |

All four also appear inside ordinary lessons, so the rooms are extra practice, not the only place a skill is trained.

### Lessons

- ✅ 18 exercise types, generated from each lesson's words and sentences.
- ✅ Word-type tags and pictures on new words, flashcard review.
- ✅ Multi-turn conversations: the character speaks, you build the reply, four turns.
- ✅ Finland facts in sentences ("Turku on Suomen vanhin kaupunki").
- 🗓️ Shorter lessons. They average about 32 steps, which is too long. Target 15 to 20.
- 🗓️ 8 A personal mistake bank, so wrong answers come back days later and not only at the end of the lesson.

### Memory

- ✅ FSRS scheduling for review. It is the current open standard for spaced repetition and replaces the older SM-2 that Anki used for years.
- 🗓️ 8 Fit FSRS to each learner's own review history once there are enough reviews.
- 🗓️ 8 Move review cards from "show and self-grade" to "type the answer" as a card matures.

### The cast

One host per lesson, mixed within a unit. Hosts react to your answers.

| Character | Who | Their topics | Lessons today |
|---|---|---|---|
| Norppa | Seal pup, the mascot | The basics, grammar explanations, nature | 1 |
| Sofia | Exchange student | Introductions, languages, university | 2 |
| Pekka | Lumberjack | Home, forest, sauna, going places | 2 |
| Aino | Barista | Shops, cafés, prices, spoken Finnish | 2 |
| Helvi | Grandma | Food, family, manners, small talk | 2 |
| Mikko | Bus driver | Numbers, directions, transport, time | 3 |
| Samir | Engineer who passed YKI | Newcomer survival, paperwork, work, exams | 3 |
| Jere | Metalhead | Drinks, music, festivals, feelings | 2 |
| Joonas | Hockey fan | Hobbies, sports, free time | 0, wanted for unit 6 or 7 |
| Joulupukki | Santa Claus | Winter, Christmas, Lapland, months and seasons | 0, wanted for the weather unit |
| Aada | Pop-punk singer | Opinions, likes and dislikes, clothes, shopping | 0, wanted for a clothes and opinions unit |
| Linh | Quantum physicist | Studying, science, technology, big numbers | 0, wanted for the work and study units |
| Tuuli | Nurse | Health, the body, the doctor, emergencies | 0, wanted for the health unit |
| Niko (18+) | Art student | Swearing, feelings, arguments | 2 |
| Leo (18+) | Bartender | Bars, flirting, dating | 2 |
| Ronja (18+) | Tattoo artist | Bodies, slang, insults | 0 |
| Veera (18+) | DJ | Clubs, nights out, the morning after | 0 |

### The 18+ track

Behind a setting, off by default. It is a parallel track with its own units, not one bonus unit. Today: 2 units, 5 lessons. Planned units: nights out (Veera), bodies and health without the euphemisms (Ronja), relationships and breakups (Leo), arguing and insults (Niko, Ronja), sex and consent, work and money complaints.

### Life in Finland

- ✅ 7 practical notes and 12 culture notes.
- 🗓️ 10 A track of scenario lessons hosted by Samir: registering at DVV, Kela, opening a bank account, the doctor, renting, job interviews.
- 🗓️ 10 YKI practice in the exam's own task formats.

### The look

- ✅ "Kaamos Ink": comic-ink panels, hard shadows, slanted type.
- ✅ Characters drawn in code with realistic proportions, sharp eyes, hard cel shadows, two body builds, varied head angles, six expressions and a signature prop each.
- ✅ A backdrop per unit that matches its topic.
- 🗓️ Full-body character art for unit headers and lesson endings. The portraits are code-drawn SVG, which has a ceiling; see open decision 3.
- 🗓️ 11 App icon and splash screen.

### Around the course

| Feature | Status |
|---|---|
| Hearts, XP, streaks, daily goal, achievements | ✅ |
| Journey map A1.1 to C2 | ✅ |
| Study guide with sources | ✅ |
| Works offline | ✅ |
| Accounts and sync | 🗓️ 6 |
| Leagues, friends, streak freeze | 🗓️ 7 |
| Reminders | 🗓️ 11 |
| Android release and installable web app | 🗓️ 11 |
| Importing your own media | ❌ |

## 5. How the language is introduced

This is the part of the plan that changes the course itself, not the app around it.

### Unit 0: the starter

Four short lessons before unit 1, hosted by Norppa. There is no vocabulary to memorise; the goal is that nothing in unit 1 looks or sounds strange.

| Lesson | Teaches | How |
|---|---|---|
| 0.1 Aakkoset | The alphabet. Finnish is spelled the way it sounds: one letter, one sound, always. The letters that matter: ä, ö, y, and j said like English y. | Hear a letter, tap it. Hear a word, pick the spelling. |
| 0.2 Pitkä ja lyhyt | Long and short sounds change the meaning: *tuli* (fire), *tuuli* (wind), *tulli* (customs). Stress is always on the first syllable. | The long-or-short listening drill that already exists, moved here and extended. |
| 0.3 Ä vai A | Vowel harmony: a word uses a, o, u or ä, ö, y, not both, and endings follow (*talossa*, *metsässä*). | Sort words into two groups; pick the ending that matches. |
| 0.4 Miten lause toimii | How a sentence is built: no articles, no grammatical gender (*hän* is he and she), no future tense, the verb ending says who is doing it (*olen*, *olet*, *on*), and small words like "in" and "from" are endings glued to the noun. | Build three-word sentences from tiles; a preview of endings with no testing. |

A learner who already knows this can skip it with a five-question check.

### The first-contact rule

Decided: the rule is strict. A form may not appear in the lesson that introduces its word, and the unit 1 and 2 sentences that break it get rewritten. The only exception is fixed phrases, as described in point 3.

1. **Plain form first.** A noun appears in its dictionary form (*Turku*, *kahvi*, *bussi*) for at least one lesson before any other form of it is used.
2. **A concept card on first contact.** The first lesson that uses a new ending opens with a short card: what it means, two or three words shown side by side in both forms (*Turku → Turussa*, *Helsinki → Helsingissä*, *Suomi → Suomessa*), and when to use it. Then two easy exercises on only that, before it shows up in sentences.
3. **Nothing early.** A sentence may only use endings whose concept card the learner has already seen. Useful phrases that break this ("Mitä kuuluu?", "Puhutko englantia?") are allowed as fixed phrases: taught whole, marked as a phrase, and not taken apart until their grammar arrives.
4. **Later forms point back.** When *Turun* appears in unit 4, its card shows the forms already known next to it: *Turku · Turussa · Turusta · Turun*.

The validator can enforce rule 3. Every word form in the lexicon already carries a tag for its ending, so each lesson only needs a list of the concepts it introduces, and the validator fails any sentence that uses a tag before its lesson.

### Where the current course breaks the rule

The four existing units were written before this rule. Known cases to fix when unit 0 is added:

- Unit 1 lesson 3 uses *ystäviä* and *opiskelijoita* (partitive plural) in "Me olemme ystäviä" and "He ovat opiskelijoita" with no explanation.
- Unit 1 lesson 4 uses *englantia* (partitive) in "Puhutko englantia?". This one can stay as a fixed phrase.
- Unit 2 lesson 1 uses *Espanjasta* and *Suomessa* in the same lesson that first teaches the words *Espanja* and *Suomi*.

This list comes from reading the lessons, not from a full audit; the validator check will find the rest.

### The order concepts arrive in (A1)

| # | Concept | Example | First used |
|---|---|---|---|
| 1 | Verb *olla* and the persons | minä olen, sinä olet | Unit 1 |
| 2 | Questions with *-ko / -kö* | Oletko sinä…? | Unit 1 |
| 3 | Negation with *ei* | en ole, en puhu | Unit 1 |
| 4 | "In": *-ssa / -ssä* | Turussa | Unit 2 |
| 5 | "From": *-sta / -stä* | Espanjasta | Unit 2 |
| 6 | Verb type 1 | puhun, asun | Unit 2 |
| 7 | Partitive after numbers and for "some" | kaksi kahvia, leipää | Unit 3 |
| 8 | "On / at / with": *-lla / -llä*; having | minulla on, bussilla | Units 3–4 |
| 9 | "Into": the illative | kauppaan, Helsinkiin | Unit 4 |
| 10 | Possession: *-n* | Turun, kirjaston vieressä | Unit 4 |
| 11 | Consonant gradation, named and explained | pankki → pankissa | Unit 4, after it has been seen a few times |
| 12 | Verb types 2–5, past tense, object forms | | Units 5–10 |

### What else is worth adding

Suggestions beyond what has been asked for so far, roughly in order of value.

| Idea | Why | When |
|---|---|---|
| **Unit checkpoint** | A short mixed test at the end of each unit, no hints, typing only. Passing it is the real "unit done". | 🗓️ 5 |
| **Placement check** | Ten questions on first launch so people who know some Finnish do not start at "hei". | 🗓️ 5 |
| **Why are you learning?** | One question on first launch (moving here, partner, study, work, curiosity) that decides which optional track is suggested first. | 🗓️ 5 |
| **Survival phrasebook** | Thirty phrases with audio, available from day one and offline, for people who land next week. | 🗓️ 5 |
| **A story per unit** | Each unit ends with a short story that uses only what has been taught, with that unit's hosts. | 🗓️ 5 |
| **Puhekieli by stages** | Show the spoken form from the start, but only test it from A1.3, so beginners are not graded on two registers at once. | 🗓️ 5 |
| **Gradation and partitive in the gym** | The case gym drills endings; the two things learners get wrong longest are which stem to use and when the partitive is needed. | 🗓️ 8 |
| **Compound-word splitter** | Long Finnish words are short words stuck together (*ruoka·kauppa*, *linja-auto·asema*). Tap to split, the same idea as the sentence breakdown. | 🗓️ 8 |
| **Word families** | Show what one root gives you: *kirja, kirjasto, kirjoittaa, kirjailija*. Cheap vocabulary. | 🗓️ 8 |

## 6. Sprint plan

About two weeks each, part-time. Roles rotate: Scrum Lead, Content Quality, Documentation, Tech Lead.

| # | Sprint | Delivers | Done when |
|---|---|---|---|
| 1 | Foundations ✅ | App, exercise engine, FSRS, 4 units, gyms, stories | Runs on web, validator passes |
| 2 | Voice and identity ✅ | Audio for every item, cast, visual style, breakdowns, journey map, 18+ pack | Every item has a clip |
| 3 | Native review ⏳ | Native speakers check units 1–4 and the 18+ units; error log | Under 2 errors per 100 sentences |
| 4 | Starter and structure | Unit 0; concept cards and the first-contact rule in the validator; units 1–4 re-ordered to obey it; frequency list for word order; kaikki.org noun and verb tables | Validator passes with the rule on; 200+ gym nouns, 100+ verbs |
| 5 | A1 complete | Units 5–10 with the hosts who have no lessons yet (Joonas, Joulupukki, Aada, Linh, Tuuli), shorter lessons, unit checkpoints, placement check, phrasebook, a story per unit | About 600 words, reviewed |
| 6 | Accounts and sync | Supabase sign-in, progress sync | Progress survives a reinstall |
| 7 | Social | Leagues, friends, streak freeze | 10 testers in one league |
| 8 | Learning science | Mistake bank, typed review, fitted FSRS, gradation and partitive drills, compound splitter, word families | Retention measured against defaults |
| 9 | Skill rooms | Listening and reading tasks with questions, AI-graded writing, speech recognition | Each room has 10 graded tasks |
| 10 | Life in Finland | Scenario track, YKI practice, more 18+ units with Ronja and Veera | 10 scenario lessons |
| 11 | Mobile release | Android build, installable web app, icon, reminders | Installable on a phone |
| 12 | Launch | Retention numbers, lesson-length test, public beta | First-month write-up |

## 7. Open decisions

1. **AI writing grader.** It needs a model and somewhere to keep the key. Options: a small server function on a free tier that calls a hosted model, with a daily cap per user; or wait for accounts (sprint 6) and attach it to them. Until then the keyword checker stays and is labelled as such.
2. **Voices.** The clips come from an unofficial free service whose terms for redistribution are unclear. Before a public release: confirm the terms, switch to the open single-voice engine, or record people.
3. **Character art.** Stay with code-drawn portraits, or commission or draw full illustrations and keep the code version as a fallback.
4. **Licence.** The repository is public but has no licence file yet, so nobody can legally reuse it. Code and course content may want different licences.
5. **How far the course goes.** B1 is the stated end. Whether B2 and beyond are lessons or only a reading and listening library is undecided.

## 8. Backlog

- AI "explain my mistake"
- Searchable grammar reference, built from the concept cards
- Swedish-speaker track for Turku / Åbo
- Custom flashcard decks
- Teacher view for university Finnish courses
