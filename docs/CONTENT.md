# Content guide

All course content lives in `src/content/` as JSON. Adding lessons needs no code changes.

## Shapes

- **Word:** `id`, `fi`, `en`, optional `altEn` (other accepted translations), `puhe` (spoken form), `note`
- **Sentence:** `id`, `fi`, `en`, optional `altFi`, `altEn`, `puhe`, `note`
- **Fill-in:** `before`, `answer`, `after`, `options` (must include the answer), `en`, optional `hint`
- **Grammar note:** blocks of `p`, `tip`, `example` (optional `puhe`) and `table`

IDs must be unique across the course: `w_<word>` for words, `s_<lesson>_<n>` for sentences, `f_<lesson>_<n>` for fill-ins. Audio files are named after ids, so don't rename ids once audio exists.

## Writing rules

1. Every sentence should be something a real person would say in Finland.
2. Add `altEn` generously — rejected correct answers frustrate learners. Contractions (I'm, don't…) are handled automatically.
3. `puhe` is the most common spoken form around Helsinki/Turku. Leave it out if identical to the textbook form.
4. 6–8 new words per lesson; reuse earlier words in sentences.

## Native review checklist

- [ ] Finnish is grammatical and natural
- [ ] English translation is accurate; `altEn` covers obvious alternatives
- [ ] `puhe` sounds natural (not exaggerated)
- [ ] Grammar notes are correct and not misleading
- [ ] Audio (once generated) is pronounced correctly — flag clips to regenerate

When done, set `"reviewed": true` on the unit and log the issues found in the sprint review.

## Importing open data

```bash
python scripts/import_kaikki.py --from-course
python scripts/import_tatoeba.py --containing kahvi,kauppa --max-words 6
```

Both write to `data/` for review; nothing ships automatically.
