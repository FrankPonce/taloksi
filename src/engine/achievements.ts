import { MAIN_UNITS, isUnitComplete } from '../content';
import type { AppState } from '../state/store';

export type Achievement = {
  id: string;
  /** Ionicons name */
  icon: string;
  title: string;
  desc: string;
  check: (s: AppState) => boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-lesson', icon: 'leaf', title: 'Ensimmäinen askel', desc: 'Finish your first lesson', check: (s) => Object.keys(s.lessons).length >= 1 },
  { id: 'streak-3', icon: 'flame', title: 'Sisu', desc: '3-day streak', check: (s) => s.streak.best >= 3 },
  { id: 'streak-7', icon: 'bonfire', title: 'Metsän sitkeys', desc: '7-day streak', check: (s) => s.streak.best >= 7 },
  { id: 'streak-30', icon: 'snow', title: 'Talven selviytyjä', desc: '30-day streak', check: (s) => s.streak.best >= 30 },
  { id: 'xp-100', icon: 'star', title: 'Sata', desc: 'Earn 100 XP', check: (s) => s.xp >= 100 },
  { id: 'xp-1000', icon: 'sparkles', title: 'Tuhat', desc: 'Earn 1000 XP', check: (s) => s.xp >= 1000 },
  { id: 'unit-1', icon: 'hand-left', title: 'Moi!', desc: 'Complete unit 1', check: (s) => isUnitComplete(MAIN_UNITS[0].id, s.lessons) },
  { id: 'all-units', icon: 'trophy', title: 'Norppa', desc: 'Complete every unit', check: (s) => MAIN_UNITS.every((u) => isUnitComplete(u.id, s.lessons)) },
  { id: 'reviews-50', icon: 'flash', title: 'Muisti', desc: '50 flashcard reviews', check: (s) => s.stats.reviews >= 50 },
  { id: 'gym-30', icon: 'barbell', title: 'Sijamuotomestari', desc: '30 correct answers in the gyms', check: (s) => s.stats.gymCorrect >= 30 },
  { id: 'story-1', icon: 'book', title: 'Lukija', desc: 'Finish a story', check: (s) => s.storiesDone.length >= 1 },
];
