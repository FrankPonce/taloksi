# Content guide

All course content lives in `src/content/` as JSON. Adding lessons needs no code changes.

## Shapes

- **Word:** `id`, `fi`, `en`, optional `altEn` (other accepted translations), `puhe` (spoken form), `note`
- **Sentence:** `id`, `fi`, `en`, optional `altFi`, `altEn`, `puhe`, `note`
- **Fill-in:** `before`, `answer`, `after`, `options` (must include the answer), `en`, optional `hint`
- **Grammar note:** blocks of `p`, `tip`, `example` (optional `puhe`) and `table`

IDs must be unique across the course: `w_<word>` for words, `s_<lesson>_<n>` for sentences, `f_<lesson>_<n>` for fill-ins. Audio files are named after ids, so don't rename ids once audio exists.

## Concept cards and the first-contact rule

Every changed form of a word in `lexicon.json` carries an ending tag (`ine`, `ela`, `ill`, `ade`, `par`, `gen`, `acc`, `p1`–`p6`, `q`, `neg`…). A concept card in `concepts.json` introduces one or more tags in the lesson it names, and the lesson opens with that card and two quick questions on it.

`npm run validate` fails a main-course sentence, fill-in, conversation line or story line when:

1. it uses a tag before the lesson whose card introduces it, or
2. it uses a changed form of a word (Turussa, kahvia) that has not appeared in its plain form in an earlier lesson.

Anything taught whole as a word or phrase (*minun nimeni on*, *puhutko englantia*) is exempt from both. So a lesson's own new nouns appear only in their plain form; use them with endings from the next lesson on. A card needs at least three examples with different meanings, because the practice questions are built from them.

The starter unit (`unit0.json`) is written as `steps` instead: `card`, `choice` and `hear` steps, played in order.

## Writing rules

1. Every sentence should be something a real person would say in Finland.
2. Add `altEn` generously — rejected correct answers frustrate learners. Contractions (I'm, don't…) are handled automatically.
3. `puhe` is the most common spoken form around Helsinki/Turku. Leave it out if identical to the textbook form.
4. 6–8 new words per lesson; reuse earlier words in sentences.

## Review checklist

No native speaker is available, so this checklist is run by Claude at the end of each content sprint. Read every sentence, note, story line and lexicon explanation in the unit.

- [ ] Finnish is grammatical and natural
- [ ] English translation is accurate; `altEn` covers obvious alternatives
- [ ] `puhe` sounds natural (not exaggerated)
- [ ] Grammar notes are correct and not misleading
- [ ] No sentence uses an ending before the lesson that introduces it (the first-contact rule); fixed phrases are marked as phrases
- [ ] Lexicon entries give the right lemma, meaning and stem | ending split
- [ ] Audio (once generated) is pronounced correctly — flag clips to regenerate

When done, set `"reviewed": true` on the unit and log the issues found in the sprint review, by category. `reviewed` means this pass was done; it does not mean a native speaker has read the unit. A native speaker's corrections, if one turns up, come in as ordinary pull requests.

## Importing open data

```bash
python scripts/import_kaikki.py --from-course
python scripts/import_tatoeba.py --containing kahvi,kauppa --max-words 6
```

Both write to `data/` for review; nothing ships automatically.
