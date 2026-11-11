import {
  createEmptyCard,
  fsrs,
  generatorParameters,
  Rating,
  type Card,
  type Grade as FsrsGrade,
} from 'ts-fsrs';

const scheduler = fsrs(generatorParameters({ enable_fuzz: true }));

export type Grade = 'again' | 'hard' | 'good' | 'easy';
const RATING: Record<Grade, FsrsGrade> = {
  again: Rating.Again as FsrsGrade,
  hard: Rating.Hard as FsrsGrade,
  good: Rating.Good as FsrsGrade,
  easy: Rating.Easy as FsrsGrade,
};

/** Cards come back from storage with string dates */
export function revive(card: Card): Card {
  return {
    ...card,
    due: new Date(card.due),
    last_review: card.last_review ? new Date(card.last_review) : undefined,
  };
}

export function reviewCard(card: Card | undefined, grade: Grade, now = new Date()): Card {
  const base = card ? revive(card) : createEmptyCard(now);
  return scheduler.next(base, now, RATING[grade]).card;
}

export const isDue = (card: Card, now = new Date()) => new Date(card.due).getTime() <= now.getTime();

export function dueIds(srs: Record<string, Card>, now = new Date()): string[] {
  return Object.entries(srs)
    .filter(([, c]) => isDue(c, now))
    .sort((a, b) => new Date(a[1].due).getTime() - new Date(b[1].due).getTime())
    .map(([id]) => id);
}
