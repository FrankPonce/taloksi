import unit1 from './units/unit1.json';
import unit2 from './units/unit2.json';
import unit3 from './units/unit3.json';
import unit4 from './units/unit4.json';
import unitx1 from './units/unitx1.json';
import storiesJson from './stories.json';
import gymJson from './gym.json';
import charactersJson from './characters.json';
import curriculumJson from './curriculum.json';
import guideJson from './guide.json';
import cultureJson from './culture.json';
import lexiconJson from './lexicon.json';
import setsJson from './sets.json';
import type { Character, CultureNote, GrammarNote, GuideTip, Item, Lesson, Link, Noun, Stage, Story, Token, Unit, Verb } from './types';

export * from './types';

export const UNITS = [unit1, unit2, unit3, unit4, unitx1] as unknown as Unit[];
export const MAIN_UNITS = UNITS.filter((u) => (u.track ?? 'main') === 'main');
export const visibleUnits = (adult: boolean) => UNITS.filter((u) => adult || u.track !== 'adult');

export const STORIES = storiesJson as unknown as Story[];
export const NOUNS = gymJson.nouns as unknown as Noun[];
export const VERBS = gymJson.verbs as unknown as Verb[];
export const CHARACTERS = charactersJson as unknown as Character[];
export const STAGES = curriculumJson.stages as unknown as Stage[];
export const CURRICULUM_NOTE = curriculumJson.note;
export const CURRICULUM_SOURCES = curriculumJson.sources as Link[];
export const GUIDE = guideJson as unknown as GuideTip[];
export const CULTURE = cultureJson as unknown as CultureNote[];
export const CATEGORIES = setsJson.categories as { id: string; label: string; words: string[] }[];
export const MINIMAL_PAIRS = setsJson.minimalPairs as { id: string; words: { fi: string; en: string }[]; note: string }[];

export type LessonRef = Lesson & { unitId: string; unitIndex: number; order: number; track: 'main' | 'adult' };

export const ALL_LESSONS: LessonRef[] = UNITS.flatMap((u, unitIndex) =>
  u.lessons.map((l) => ({ ...l, unitId: u.id, unitIndex, order: 0, track: u.track ?? ('main' as const) }))
).map((l, order) => ({ ...l, order }));
export const MAIN_LESSONS = ALL_LESSONS.filter((l) => l.track === 'main');

export const ALL_GRAMMAR: GrammarNote[] = UNITS.flatMap((u) => u.grammar);

type IndexedItem = Item & { adult: boolean };
const itemIndex = new Map<string, IndexedItem>();
for (const l of ALL_LESSONS) {
  const adult = l.track === 'adult';
  for (const w of l.words) itemIndex.set(w.id, { ...w, kind: 'word', adult });
  for (const s of l.sentences) itemIndex.set(s.id, { ...s, kind: 'sentence', adult });
}

export const ALL_ITEMS: IndexedItem[] = [...itemIndex.values()];
/** Pools used for wrong answers. Adult words never leak into the main course. */
export const wordPool = (adult: boolean) => ALL_ITEMS.filter((i) => i.kind === 'word' && (adult || !i.adult));
export const sentencePool = (adult: boolean) => ALL_ITEMS.filter((i) => i.kind === 'sentence' && (adult || !i.adult));

export const getItem = (id: string) => itemIndex.get(id);
export const getLesson = (id: string) => ALL_LESSONS.find((l) => l.id === id);
export const getGrammar = (id: string) => ALL_GRAMMAR.find((g) => g.id === id);
export const getStory = (id: string) => STORIES.find((s) => s.id === id);
export const getUnit = (id: string) => UNITS.find((u) => u.id === id);
export const getCharacter = (id?: string) => (id ? CHARACTERS.find((c) => c.id === id) : undefined);
export const getTip = (id: string) => GUIDE.find((t) => t.id === id);
export const getCulture = (id: string) => CULTURE.find((c) => c.id === id);
export const cultureFor = (unitId: string) => CULTURE.filter((c) => c.unit === unitId);

/** Lessons unlock one after another within their own track; each track's first lesson is open. */
export function isLessonUnlocked(lessonId: string, done: Record<string, unknown>, unlockAll: boolean): boolean {
  if (unlockAll) return true;
  const l = getLesson(lessonId);
  if (!l) return false;
  const track = ALL_LESSONS.filter((x) => x.track === l.track);
  const i = track.findIndex((x) => x.id === l.id);
  return i <= 0 || !!done[track[i - 1].id];
}

export function isUnitComplete(unitId: string, done: Record<string, unknown>) {
  const u = getUnit(unitId);
  return !!u && u.lessons.every((l) => done[l.id]);
}

/** Which stage of the journey the learner is in, and how far through it */
export function currentStage(done: Record<string, unknown>): { stage: Stage; progress: number } {
  for (const stage of STAGES) {
    if (stage.status !== 'available') return { stage, progress: 0 };
    const lessons = stage.units.flatMap((id) => getUnit(id)?.lessons ?? []);
    const n = lessons.filter((l) => done[l.id]).length;
    if (n < lessons.length) return { stage, progress: lessons.length ? n / lessons.length : 0 };
  }
  return { stage: STAGES[STAGES.length - 1], progress: 1 };
}

const lexicon = lexiconJson as unknown as Record<string, string[]>;

/** Words of a sentence without punctuation, original capitalisation kept */
export const words = (s: string) => s.replace(/[.,!?;:"“”]/g, '').split(/\s+/).filter(Boolean);

/** Take a Finnish sentence apart word by word, using lexicon.json */
export function breakdown(fi: string): Token[] {
  return words(fi).map((text) => {
    const e = lexicon[text.toLowerCase()];
    if (!e) return { text, lemma: text, en: '', parts: [text], why: '', known: false };
    const [lemma, en, seg, why, tag] = e;
    // Keep the capitalisation the sentence used
    const parts = seg.split('|');
    if (text[0] !== text[0].toLowerCase()) parts[0] = parts[0][0].toUpperCase() + parts[0].slice(1);
    return { text, lemma, en, parts, why, tag, known: true };
  });
}
