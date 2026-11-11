import {
  ALL_ITEMS,
  breakdown,
  CATEGORIES,
  getItem,
  MINIMAL_PAIRS,
  sentencePool,
  wordPool,
  words as splitWords,
  type FillBlank,
  type Item,
  type Lesson,
  type Word,
} from '../content';
import { distractors, pick, sample, shuffle } from './random';

export type Dir = 'fi-en' | 'en-fi';

export type ChoiceVariant = 'odd' | 'ending' | 'register' | 'judge' | 'hear';

export type Exercise =
  | { kind: 'intro'; key: string; word: Word }
  | {
      kind: 'pick';
      key: string;
      itemId: string;
      dir: Dir;
      prompt: string;
      choices: string[];
      answer: string;
      fi: string;
      warmup?: boolean;
    }
  | { kind: 'match'; key: string; pairs: { id: string; fi: string; en: string }[] }
  | {
      kind: 'build';
      key: string;
      itemId: string;
      dir: Dir;
      prompt: string;
      fi: string;
      tiles: string[];
      accepted: string[];
      speaker?: string;
    }
  | { kind: 'listen'; key: string; itemId: string; fi: string; en: string; tiles: string[]; accepted: string[]; speaker?: string }
  | { kind: 'type'; key: string; itemId: string; dir: Dir; prompt: string; fi: string; accepted: string[]; speaker?: string }
  | { kind: 'fill'; key: string; fill: FillBlank }
  | {
      /** Every "pick one answer" exercise beyond plain vocabulary */
      kind: 'choice';
      key: string;
      variant: ChoiceVariant;
      itemId?: string;
      title: string;
      /** Finnish text shown (and spoken) as the prompt */
      fi?: string;
      /** extra line under the prompt */
      sub?: string;
      /** audio-only prompt: the text stays hidden until answered */
      audio?: { text: string; id?: string };
      speaker?: string;
      choices: string[];
      answer: string;
      note?: string;
    };

const accepted = (it: Item, lang: 'fi' | 'en') =>
  lang === 'fi' ? [it.fi, ...(it.altFi ?? [])] : [it.en, ...(it.altEn ?? [])];

/**
 * Words that stay capitalised anywhere in a sentence (names, places, "I").
 * Everything else is lower-cased on tiles so the first word doesn't give itself away.
 */
const PROPER = new Set<string>();
for (const it of ALL_ITEMS) {
  if (it.kind !== 'sentence') continue;
  for (const text of [it.fi, it.en]) {
    splitWords(text)
      .slice(1)
      .filter((w) => w[0] !== w[0].toLowerCase())
      .forEach((w) => PROPER.add(w));
  }
}
const tile = (w: string) => (PROPER.has(w) ? w : w.toLowerCase());

function tilesFor(answer: string, lang: 'fi' | 'en', adult: boolean, extra = 3): string[] {
  const tokens = splitWords(answer).map(tile);
  const pool = sentencePool(adult).flatMap((s) => splitWords(lang === 'fi' ? s.fi : s.en).map(tile));
  return shuffle([...tokens, ...distractors(pool, tokens, extra)]);
}

export function pickExercise(item: Item, dir: Dir, key: string, adult = false, warmup = false): Exercise {
  const pool = wordPool(adult).map((w) => (dir === 'fi-en' ? w.en : w.fi));
  const answer = dir === 'fi-en' ? item.en : item.fi;
  return {
    kind: 'pick',
    key,
    itemId: item.id,
    dir,
    prompt: dir === 'fi-en' ? item.fi : item.en,
    answer,
    fi: item.fi,
    warmup,
    choices: shuffle([answer, ...distractors(pool, accepted(item, dir === 'fi-en' ? 'en' : 'fi'), 3)]),
  };
}

export function buildExercise(item: Item, dir: Dir, key: string, adult = false): Exercise {
  const target = dir === 'fi-en' ? 'en' : 'fi';
  const answer = target === 'en' ? item.en : item.fi;
  return {
    kind: 'build',
    key,
    itemId: item.id,
    dir,
    prompt: dir === 'fi-en' ? item.fi : item.en,
    fi: item.fi,
    tiles: tilesFor(answer, target, adult),
    accepted: accepted(item, target),
    speaker: item.speaker,
  };
}

export function listenExercise(item: Item, key: string, adult = false): Exercise {
  return {
    kind: 'listen',
    key,
    itemId: item.id,
    fi: item.fi,
    en: item.en,
    tiles: tilesFor(item.fi, 'fi', adult),
    accepted: [item.fi],
    speaker: item.speaker,
  };
}

export function typeExercise(item: Item, dir: Dir, key: string): Exercise {
  return {
    kind: 'type',
    key,
    itemId: item.id,
    dir,
    prompt: dir === 'fi-en' ? item.fi : item.en,
    fi: item.fi,
    accepted: accepted(item, dir === 'fi-en' ? 'en' : 'fi'),
    speaker: item.speaker,
  };
}

// ── Choice exercises ────────────────────────────────────────────────────────

const glossOf = (fi: string) => ALL_ITEMS.find((i) => i.kind === 'word' && i.fi === fi)?.en;

/** Three words from one category and one intruder */
export function oddOneOut(lesson: Lesson, key: string): Exercise | null {
  const lessonWords = new Set(lesson.words.map((w) => w.fi));
  const home = shuffle(CATEGORIES.filter((c) => c.words.some((w) => lessonWords.has(w)) && c.words.length >= 3))[0];
  if (!home) return null;
  const other = pick(CATEGORIES.filter((c) => c.id !== home.id && !c.words.some((w) => home.words.includes(w))));
  // Prefer this lesson's own words so the exercise practises what was just taught
  const mine = shuffle(home.words.filter((w) => lessonWords.has(w)));
  const rest = shuffle(home.words.filter((w) => !lessonWords.has(w)));
  const three = [...mine, ...rest].slice(0, 3);
  const odd = pick(other.words);
  const gloss = (w: string) => (glossOf(w) ? `${w} = ${glossOf(w)}` : w);
  return {
    kind: 'choice',
    key,
    variant: 'odd',
    title: 'Mikä ei kuulu joukkoon? · Which one does not belong?',
    choices: shuffle([...three, odd]),
    answer: odd,
    note: `The others are ${home.label}: ${three.map(gloss).join(', ')}. But ${gloss(odd)}.`,
  };
}

const CASE_MEANING: Record<string, string> = {
  ine: 'in, inside',
  ela: 'out of, from',
  ill: 'into, to',
  ade: 'on, at, with',
  all: 'onto, to (someone)',
  par: 'some, an amount of',
};
const PERSON: Record<string, string> = { p1: 'minä (I)', p2: 'sinä (you)', p3: 'hän (he/she)', p4: 'me (we)', p6: 'he (they)' };

/** Point at one word of a real sentence and ask what its ending is doing */
export function endingDetective(item: Item, key: string): Exercise | null {
  const tokens = breakdown(item.fi).filter((t) => t.tag && t.parts.length > 1 && (CASE_MEANING[t.tag] || PERSON[t.tag]));
  if (!tokens.length) return null;
  const t = pick(tokens);
  const tag = t.tag as string;
  const table = CASE_MEANING[tag] ? CASE_MEANING : PERSON;
  const ending = t.parts.slice(1).join('');
  return {
    kind: 'choice',
    key,
    variant: 'ending',
    itemId: item.id,
    speaker: item.speaker,
    title: 'Päätesalapoliisi · Ending detective',
    fi: item.fi,
    sub: CASE_MEANING[tag]
      ? `In “${t.text}”, what does the ending -${ending} mean?`
      : `In “${t.text}”, who is doing it? Look at the ending -${ending}.`,
    choices: shuffle([table[tag], ...sample(Object.values(table).filter((v) => v !== table[tag]), 3)]),
    answer: table[tag],
    note: `${t.parts[0]} + ${t.parts.slice(1).map((p) => `-${p}`).join(' + ')}. ${t.why}`,
  };
}

/** Textbook sentence → pick how it actually sounds on the street */
export function registerExercise(item: Item, lesson: Lesson, key: string, adult: boolean): Exercise | null {
  if (!item.puhe) return null;
  const near = lesson.sentences.filter((s) => s.puhe && s.id !== item.id).map((s) => s.puhe as string);
  const far = sentencePool(adult).filter((s) => s.puhe && s.id !== item.id).map((s) => s.puhe as string);
  const wrong = [...distractors(near, [item.puhe], 2), ...distractors(far, [item.puhe, ...near], 2)].slice(0, 2);
  if (wrong.length < 2) return null;
  return {
    kind: 'choice',
    key,
    variant: 'register',
    itemId: item.id,
    speaker: 'aino',
    title: 'Kadulla · How would you hear it on the street?',
    fi: item.fi,
    sub: 'Pick the spoken-Finnish version.',
    choices: shuffle([item.puhe, ...wrong]),
    answer: item.puhe,
    note: `Kirjakieli: ${item.fi}  →  Puhekieli: ${item.puhe}`,
  };
}

const YES = 'Kyllä · Yes';
const NO = 'Ei · No';

/** Does this translation match? Quick true/false to keep meaning sharp */
export function judgeExercise(item: Item, lesson: Lesson, key: string): Exercise | null {
  const others = lesson.sentences.filter((s) => s.id !== item.id);
  if (!others.length) return null;
  const truthful = Math.random() < 0.5;
  const shown = truthful ? item.en : pick(others).en;
  return {
    kind: 'choice',
    key,
    variant: 'judge',
    itemId: item.id,
    speaker: item.speaker,
    title: 'Totta vai tarua? · True or false?',
    fi: item.fi,
    sub: `Does this mean: “${shown}”`,
    choices: [YES, NO],
    answer: truthful ? YES : NO,
    note: truthful ? undefined : `It means: “${item.en}”`,
  };
}

/** Sound-alike words that differ only in length: which one did you hear? */
export function hearExercise(index: number, key: string): Exercise {
  const set = MINIMAL_PAIRS[index % MINIMAL_PAIRS.length];
  const target = pick(set.words);
  const label = (w: { fi: string; en: string }) => `${w.fi}  (${w.en})`;
  return {
    kind: 'choice',
    key,
    variant: 'hear',
    title: 'Pitkä vai lyhyt? · Long or short?',
    audio: { text: target.fi, id: `mp_${target.fi}` },
    sub: 'Listen. Which word was it?',
    choices: set.words.map(label),
    answer: label(target),
    note: set.note,
  };
}

// ── Lesson builder ──────────────────────────────────────────────────────────

/**
 * Builds a lesson session. The order follows what the research in the study
 * guide recommends: a short warm-up that retrieves older material (spacing),
 * new words as input before any testing, then varied retrieval that mixes
 * recognition, production, listening and form-focused questions.
 */
export function buildLessonExercises(
  lesson: Lesson,
  opts: { replay?: boolean; adult?: boolean; warmupIds?: string[]; lessonIndex?: number } = {}
): Exercise[] {
  const adult = !!opts.adult;
  const words: Item[] = lesson.words.map((w) => ({ ...w, kind: 'word' }));
  const sentences: Item[] = lesson.sentences.map((s) => ({ ...s, kind: 'sentence' }));
  const out: Exercise[] = [];
  const push = (e: Exercise | null) => e && out.push(e);

  // 0. Warm-up: two things learned earlier, pulled back from memory
  (opts.warmupIds ?? []).slice(0, 2).forEach((id) => {
    const it = getItem(id);
    if (it && it.kind === 'word') out.push(pickExercise(it, 'en-fi', `warm-${id}`, adult || it.adult, true));
  });

  // 1. New words: intro cards in pairs, each followed by a quick check
  for (let i = 0; i < lesson.words.length; i += 2) {
    const chunk = lesson.words.slice(i, i + 2);
    if (!opts.replay) chunk.forEach((w) => out.push({ kind: 'intro', key: `intro-${w.id}`, word: w }));
    chunk.forEach((w, j) =>
      out.push(pickExercise({ ...w, kind: 'word' }, (i + j) % 2 === 0 ? 'fi-en' : 'en-fi', `pick-${w.id}`, adult))
    );
  }

  // 2. Words together: match pairs, then spot the intruder
  if (words.length >= 3) {
    out.push({
      kind: 'match',
      key: `match-${lesson.id}`,
      pairs: sample(words, Math.min(5, words.length)).map((w) => ({ id: w.id, fi: w.fi, en: w.en })),
    });
  }
  push(oddOneOut(lesson, `odd-${lesson.id}`));

  // 3. Sentences: rotate through translation and listening, with one of each
  //    special exercise slotted in between
  const extras: (Exercise | null)[] = [];
  const withEnding = shuffle(sentences).find((s) => endingDetective(s, 'x'));
  if (withEnding) extras.push(endingDetective(withEnding, `ending-${withEnding.id}`));
  const withPuhe = shuffle(sentences).find((s) => s.puhe);
  if (withPuhe) extras.push(registerExercise(withPuhe, lesson, `register-${withPuhe.id}`, adult));
  if (sentences.length > 1) extras.push(judgeExercise(pick(sentences), lesson, `judge-${lesson.id}`));
  extras.push(hearExercise(opts.lessonIndex ?? 0, `hear-${lesson.id}`));

  const rotation = ['build-fi-en', 'build-en-fi', 'listen', 'build-fi-en', 'build-en-fi'] as const;
  sentences.forEach((s, i) => {
    const t = rotation[i % rotation.length];
    if (t === 'listen') out.push(listenExercise(s, `listen-${s.id}`, adult));
    else out.push(buildExercise(s, t === 'build-fi-en' ? 'fi-en' : 'en-fi', `${t}-${s.id}`, adult));
    if (i >= 1) push(extras.shift() ?? null);
  });
  extras.forEach(push);

  // 4. One typing challenge on the shortest sentence (full production)
  const shortest = [...sentences].sort((a, b) => a.fi.length - b.fi.length)[0];
  if (shortest) out.push(typeExercise(shortest, 'en-fi', `type-${shortest.id}`));

  // 5. Grammar fill-ins
  (lesson.fill ?? []).forEach((f) => out.push({ kind: 'fill', key: `fill-${f.id}`, fill: f }));

  return out;
}

/** Ids that go into spaced repetition after finishing the lesson */
export const lessonItemIds = (lesson: Lesson) => [
  ...lesson.words.map((w) => w.id),
  ...lesson.sentences.map((s) => s.id),
];
