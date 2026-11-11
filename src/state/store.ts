import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Card } from 'ts-fsrs';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ACHIEVEMENTS } from '../engine/achievements';
import { todayKey, yesterdayKey } from '../engine/dates';
import { reviewCard, type Grade } from '../engine/srs';

export const MAX_HEARTS = 5;
export const HEART_REFILL_MS = 30 * 60 * 1000;

export type Settings = {
  dailyGoal: number;
  showPuhekieli: boolean;
  strictUmlauts: boolean;
  audioRate: number;
  unlimitedHearts: boolean;
  unlockAll: boolean;
  /** 18+ content: bar talk, swearing, dating */
  adult: boolean;
  /** short sound effects for right, wrong, tap and lesson complete */
  sfx: boolean;
};

export type LessonRecord = { completions: number; bestAccuracy: number; lastAt: string };

type Data = {
  xp: number;
  streak: { count: number; best: number; lastDay: string | null };
  daily: { day: string; xp: number };
  hearts: { count: number; updatedAt: number };
  lessons: Record<string, LessonRecord>;
  srs: Record<string, Card>;
  storiesDone: string[];
  /** best score (0–5) per writing task */
  writing: Record<string, number>;
  achievements: string[];
  /** achievements unlocked but not yet shown to the user */
  newAchievements: string[];
  stats: { correct: number; answered: number; reviews: number; gymCorrect: number };
  settings: Settings;
};

type Actions = {
  earnXp: (n: number) => void;
  loseHeart: () => void;
  gainHeart: (n?: number) => void;
  syncHearts: () => void;
  recordAnswer: (correct: boolean) => void;
  completeLesson: (lessonId: string, itemIds: string[], accuracy: number, xp: number) => void;
  review: (itemId: string, grade: Grade) => void;
  completeStory: (id: string, xp: number) => void;
  completeWriting: (id: string, score: number) => void;
  gymAnswer: (correct: boolean) => void;
  setSetting: <K extends keyof Settings>(k: K, v: Settings[K]) => void;
  clearNewAchievements: () => void;
  resetProgress: () => void;
};

export type AppState = Data & Actions;

const initial = (): Data => ({
  xp: 0,
  streak: { count: 0, best: 0, lastDay: null },
  daily: { day: todayKey(), xp: 0 },
  hearts: { count: MAX_HEARTS, updatedAt: Date.now() },
  lessons: {},
  srs: {},
  storiesDone: [],
  writing: {},
  achievements: [],
  newAchievements: [],
  stats: { correct: 0, answered: 0, reviews: 0, gymCorrect: 0 },
  settings: {
    dailyGoal: 20,
    showPuhekieli: true,
    strictUmlauts: false,
    audioRate: 1,
    unlimitedHearts: false,
    unlockAll: false,
    adult: false,
    sfx: true,
  },
});

function refilledHearts(h: Data['hearts'], now = Date.now()): Data['hearts'] {
  if (h.count >= MAX_HEARTS) return { count: MAX_HEARTS, updatedAt: now };
  const gained = Math.floor((now - h.updatedAt) / HEART_REFILL_MS);
  if (gained <= 0) return h;
  const count = Math.min(MAX_HEARTS, h.count + gained);
  return { count, updatedAt: count >= MAX_HEARTS ? now : h.updatedAt + gained * HEART_REFILL_MS };
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => {
      const awardAchievements = () => {
        const s = get();
        const fresh = ACHIEVEMENTS.filter((a) => !s.achievements.includes(a.id) && a.check(s)).map((a) => a.id);
        if (fresh.length)
          set({ achievements: [...s.achievements, ...fresh], newAchievements: [...s.newAchievements, ...fresh] });
      };

      return {
        ...initial(),

        earnXp: (n) => {
          const s = get();
          const today = todayKey();
          let { count, best, lastDay } = s.streak;
          if (lastDay !== today) {
            count = lastDay === yesterdayKey() ? count + 1 : 1;
            best = Math.max(best, count);
            lastDay = today;
          }
          const daily = s.daily.day === today ? { day: today, xp: s.daily.xp + n } : { day: today, xp: n };
          set({ xp: s.xp + n, daily, streak: { count, best, lastDay } });
          awardAchievements();
        },

        syncHearts: () => set({ hearts: refilledHearts(get().hearts) }),
        loseHeart: () => {
          if (get().settings.unlimitedHearts) return;
          const h = refilledHearts(get().hearts);
          set({
            hearts: {
              count: Math.max(0, h.count - 1),
              updatedAt: h.count >= MAX_HEARTS ? Date.now() : h.updatedAt,
            },
          });
        },
        gainHeart: (n = 1) => {
          const h = refilledHearts(get().hearts);
          set({ hearts: { count: Math.min(MAX_HEARTS, h.count + n), updatedAt: h.updatedAt } });
        },

        recordAnswer: (correct) => {
          const st = get().stats;
          set({ stats: { ...st, answered: st.answered + 1, correct: st.correct + (correct ? 1 : 0) } });
        },

        completeLesson: (lessonId, itemIds, accuracy, xp) => {
          const s = get();
          const prev = s.lessons[lessonId];
          const srs = { ...s.srs };
          for (const id of itemIds) if (!srs[id]) srs[id] = reviewCard(undefined, accuracy >= 0.9 ? 'good' : 'hard');
          set({
            srs,
            lessons: {
              ...s.lessons,
              [lessonId]: {
                completions: (prev?.completions ?? 0) + 1,
                bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, accuracy),
                lastAt: new Date().toISOString(),
              },
            },
          });
          get().earnXp(xp);
        },

        review: (itemId, grade) => {
          const s = get();
          set({
            srs: { ...s.srs, [itemId]: reviewCard(s.srs[itemId], grade) },
            stats: { ...s.stats, reviews: s.stats.reviews + 1 },
          });
          awardAchievements();
        },

        completeStory: (id, xp) => {
          const s = get();
          if (!s.storiesDone.includes(id)) set({ storiesDone: [...s.storiesDone, id] });
          get().earnXp(xp);
        },

        completeWriting: (id, score) => {
          const s = get();
          const best = s.writing[id];
          set({ writing: { ...s.writing, [id]: Math.max(best ?? 0, score) } });
          // XP for the first attempt and for each time the best score improves
          if (best === undefined || score > best) get().earnXp(5 + score);
        },

        gymAnswer: (correct) => {
          const st = get().stats;
          set({ stats: { ...st, gymCorrect: st.gymCorrect + (correct ? 1 : 0) } });
          get().recordAnswer(correct);
          awardAchievements();
        },

        setSetting: (k, v) => set({ settings: { ...get().settings, [k]: v } }),
        clearNewAchievements: () => set({ newAchievements: [] }),
        resetProgress: () => set({ ...initial(), settings: get().settings }),
      };
    },
    {
      // The key keeps the app's first name on purpose: changing it would wipe everyone's saved progress
      name: 'suomeksi-progress',
      version: 1,
      // Keep new settings' defaults when loading progress saved by an older build
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Data>;
        return { ...current, ...p, settings: { ...current.settings, ...(p.settings ?? {}) } };
      },
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => {
        const { earnXp, loseHeart, gainHeart, syncHearts, recordAnswer, completeLesson, review, completeStory, completeWriting, gymAnswer, setSetting, clearNewAchievements, resetProgress, ...data } = s;
        return data;
      },
    }
  )
);

/** Streak counts only if the user practised today or yesterday */
export function liveStreak(s: Pick<Data, 'streak'>): number {
  const { lastDay, count } = s.streak;
  return lastDay === todayKey() || lastDay === yesterdayKey() ? count : 0;
}
