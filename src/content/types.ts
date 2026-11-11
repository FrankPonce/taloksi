export type Pos = 'noun' | 'verb' | 'adj' | 'adv' | 'pron' | 'num' | 'question' | 'particle' | 'phrase';

export type Word = {
  id: string;
  fi: string;
  en: string;
  /** word type, shown as a tag when the word is taught */
  pos?: Pos;
  /** MaterialCommunityIcons name used as the word's picture */
  icon?: string;
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
  /** set when the sentence states something true about Finland; shown as a "did you know" */
  fact?: string;
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

/** One example on a concept card: an optional starting form, the form being taught, its meaning */
export type ConceptExample = {
  from?: string;
  fi: string;
  en: string;
  /** wrong forms used as distractors in the practice question */
  wrong?: string[];
  /** id of an existing audio clip to reuse; otherwise `${card.id}_${index}` */
  audio?: string;
};

/**
 * A short explanation that opens the first lesson to use a new ending or rule.
 * Cards in concepts.json gate the ending `tags` they list: no sentence may use
 * those endings before the card's lesson (the first-contact rule). Cards with
 * no tags are reminders that deepen something already introduced.
 */
export type ConceptCard = {
  id: string;
  /** lesson the card opens; starter-lesson cards live inline in `steps` instead */
  lesson?: string;
  tags?: string[];
  title: string;
  titleEn: string;
  body: string[];
  examples: ConceptExample[];
};

/** Authored steps for the starter unit, which teaches sounds and structure instead of vocabulary */
export type Step =
  | { type: 'card'; card: ConceptCard }
  | {
      type: 'choice';
      title: string;
      /** Finnish shown as the prompt (with audio) */
      fi?: string;
      /** Finnish only played, not shown, until answered */
      listen?: string;
      sub?: string;
      choices: string[];
      answer: string;
      note?: string;
      /** keep the choices in the written order instead of shuffling */
      keepOrder?: boolean;
    }
  | { type: 'hear'; pair: string };

export type Lesson = {
  id: string;
  title: string;
  titleEn: string;
  words: Word[];
  sentences: Sentence[];
  fill?: FillBlank[];
  /** character who teaches this lesson: they present every exercise and say most of the lines */
  host?: string;
  /** id of a grammar note to suggest before the lesson */
  grammar?: string;
  /** starter lessons are authored step by step instead of generated */
  steps?: Step[];
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
  /** character who fronts this unit */
  host?: string;
  /** background scene drawn behind the unit header */
  scene?: 'lake' | 'river' | 'cafe' | 'city' | 'bar' | 'forest';
  /** 'adult' units are hidden unless the 18+ setting is on. Default: main path */
  track?: 'main' | 'adult';
  /** the optional starter unit: its lessons chain among themselves and never block unit 1 */
  starter?: boolean;
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
  pos?: Pos;
  icon?: string;
  fact?: string;
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
  /** only shown when the 18+ setting is on */
  adult?: boolean;
  /** topics this character tends to teach */
  likes: string;
  /** how their name tag looks */
  tag: { style: 'punk' | 'plank' | 'note' | 'sleeve' | 'lace' | 'ticket' | 'badge' | 'ice' | 'tape' | 'neon' | 'jersey' | 'gift'; bg: string; fg: string; accent: string; icon: string };
  avatar?: {
    skin: string;
    hair: string;
    hairStyle: 'bob' | 'short' | 'pony' | 'bun' | 'cap' | 'curly' | 'long' | 'emo' | 'undercut' | 'beanie' | 'wolfcut' | 'swept' | 'santa' | 'sidelocks';
    shirt: string;
    outfit?: 'hoodie' | 'flannel' | 'apron' | 'cardigan' | 'uniform' | 'shirt' | 'vest' | 'jacket' | 'tee' | 'jersey' | 'santa' | 'tie' | 'labcoat' | 'scrubs';
    extras?: string[];
    /** iris colour */
    eyes?: string;
    /** 'sharp' eyes are narrower; default is round */
    eyeStyle?: 'round' | 'sharp';
    /** 'soft' rounds the jaw; default is angular */
    jaw?: 'soft';
    /** something they carry: it makes the silhouette theirs */
    prop?: 'axe' | 'guitar' | 'needles' | 'pencil' | 'headphones';
    /** which way the head is turned: -1 to the viewer's left, 1 to the right. Default faces the viewer. */
    turn?: -1 | 0 | 1;
    /** head tilt in degrees */
    tilt?: number;
    /** hat colour, for the beanie */
    hat?: string;
  };
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
  /** 'life' notes are practical guides to living in Finland */
  kind?: 'life';
  unit?: string;
  adult?: boolean;
  icon: string;
  title: string;
  titleEn: string;
  body: string[];
  words: { fi: string; en: string }[];
  source?: Link;
};

export type DialogueLine = { fi: string; en: string };
/** A short conversation: the character speaks, the learner builds the reply */
export type Dialogue = {
  id: string;
  /** lesson this conversation is practised in */
  lesson: string;
  title: string;
  titleEn: string;
  /** character the learner talks to */
  with: string;
  turns: { them: DialogueLine; you: DialogueLine }[];
};

export type WritingPrompt = {
  id: string;
  level: string;
  /** lesson that unlocks it */
  after: string;
  title: string;
  titleEn: string;
  task: string;
  minWords: number;
  /** things the text should contain; `any` holds lower-case patterns that count as covering the point */
  points: { id: string; label: string; hint: string; any: string[] }[];
  model: string;
  modelEn: string;
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
