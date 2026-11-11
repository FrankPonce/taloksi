export type Word = {
  id: string;
  fi: string;
  en: string;
  altEn?: string[];
  /** Spoken-Finnish (puhekieli) variant, if different */
  puhe?: string;
  note?: string;
};

export type Sentence = {
  id: string;
  fi: string;
  en: string;
  altFi?: string[];
  altEn?: string[];
  puhe?: string;
  note?: string;
  /** id of the character who says this line (see characters.json) */
  speaker?: string;
};

export type FillBlank = {
  id: string;
  before: string;
  after: string;
  answer: string;
  options: string[];
  en: string;
  hint?: string;
};

export type Lesson = {
  id: string;
  title: string;
  titleEn: string;
  words: Word[];
  sentences: Sentence[];
  fill?: FillBlank[];
  /** id of a grammar note to suggest before the lesson */
  grammar?: string;
};

export type GrammarBlock =
  | { type: 'p'; text: string }
  | { type: 'tip'; text: string }
  | { type: 'example'; fi: string; en: string; puhe?: string }
  | { type: 'table'; head: string[]; rows: string[][] };

export type GrammarNote = {
  id: string;
  title: string;
  titleEn: string;
  blocks: GrammarBlock[];
};

export type Unit = {
  id: string;
  title: string;
  titleEn: string;
  color: string;
  /** 'adult' units are hidden unless the 18+ setting is on. Default: main path */
  track?: 'main' | 'adult';
  /** Has a native speaker reviewed this unit? */
  reviewed: boolean;
  lessons: Lesson[];
  grammar: GrammarNote[];
};

export type StoryLine = { id: string; speaker?: string; speakerId?: string; fi: string; en: string };
export type StoryQuestion = { q: string; choices: string[]; answer: number };
export type Story = {
  id: string;
  title: string;
  titleEn: string;
  unlockAfter: string;
  lines: StoryLine[];
  questions: StoryQuestion[];
};

export const CASES = [
  'genetiivi',
  'partitiivi',
  'inessiivi',
  'elatiivi',
  'illatiivi',
  'adessiivi',
  'ablatiivi',
  'allatiivi',
  'essiivi',
  'translatiivi',
] as const;
export type CaseName = (typeof CASES)[number];

export type Noun = {
  fi: string;
  en: string;
  forms: Record<CaseName, string>;
  note?: string;
};

export type Verb = {
  inf: string;
  en: string;
  /** minä, sinä, hän, me, te, he */
  forms: string[];
  /** mä, sä, se, me, te, ne */
  puhe: string[];
};

/** Anything that can go into spaced repetition */
export type Item = {
  id: string;
  kind: 'word' | 'sentence';
  fi: string;
  en: string;
  puhe?: string;
  altFi?: string[];
  altEn?: string[];
  speaker?: string;
  note?: string;
};

export type Character = {
  id: string;
  name: string;
  role: string;
  roleEn: string;
  bio: string;
  /** a line in the character's own voice, for the cast screen */
  hello: string;
  color: string;
  avatar?: { skin: string; hair: string; hairStyle: 'bob' | 'short' | 'pony' | 'bun' | 'cap' | 'curly'; shirt: string; extras?: string[] };
  voice: { base: 'noora' | 'harri'; pitch: string; rate: string; gender: 'f' | 'm'; webPitch: number; webRate: number };
};

export type Link = { label: string; url: string };

export type Stage = {
  id: string;
  cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  code: string;
  yki: number;
  name: string;
  nameEn: string;
  units: string[];
  status: 'available' | 'planned';
  words: number;
  hours: string;
  milestone: string;
  canDo: string[];
  grammar: string[];
  themes: string[];
};

export type GuideTip = {
  id: string;
  icon: string;
  title: string;
  titleEn: string;
  summary: string;
  body: string[];
  doThis: string[];
  inApp: string;
  sources: Link[];
};

export type CultureNote = {
  id: string;
  unit?: string;
  adult?: boolean;
  icon: string;
  title: string;
  titleEn: string;
  body: string[];
  words: { fi: string; en: string }[];
  source?: Link;
};

/** One word of a sentence, taken apart */
export type Token = {
  text: string;
  lemma: string;
  en: string;
  /** stem first, then endings */
  parts: string[];
  why: string;
  tag?: string;
  known: boolean;
};
