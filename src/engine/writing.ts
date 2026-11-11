import type { WritingPrompt } from '../content';

export type WritingCheck = {
  words: number;
  lengthOk: boolean;
  points: { id: string; label: string; hint: string; ok: boolean }[];
  /** 0–5 */
  score: number;
  tips: string[];
};

/**
 * Offline check of a free-writing answer. It does NOT understand Finnish: it
 * looks for the things the task asked for (by keyword patterns from
 * writing.json), counts words, and catches a few mechanical slips. It cannot
 * judge grammar or word choice. That needs a real reader or an AI grader,
 * which plugs in beside this (see HANDOFF.md).
 */
export function quickCheck(prompt: WritingPrompt, text: string): WritingCheck {
  const lower = text.toLowerCase();
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const points = prompt.points.map((p) => ({
    id: p.id,
    label: p.label,
    hint: p.hint,
    ok: p.any.some((pattern) => new RegExp(pattern, 'i').test(lower)),
  }));
  const covered = points.filter((p) => p.ok).length;
  const lengthOk = words >= prompt.minWords;

  const tips: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim());
  if (sentences.some((s) => /^[a-zäöå]/.test(s.trim()))) tips.push('Start each sentence with a capital letter.');
  if (text.trim() && !/[.!?]$/.test(text.trim())) tips.push('End your last sentence with a full stop.');
  if (words >= 8 && !/[äö]/i.test(text)) tips.push('No ä or ö anywhere? Check words like "minä", "sinä", "hyvää".');
  if (/\bmina\b|\bsina\b|\bmita\b|\bhyvaa\b|\bpaiva/.test(lower)) tips.push('Some words are missing their dots: mina → minä, hyvaa → hyvää.');
  if (!lengthOk) tips.push(`Write a little more: at least ${prompt.minWords} words (you have ${words}).`);
  if (/\bi am\b|\bmy name\b|\bthe\b/.test(lower)) tips.push('Some of this is still in English. Try the whole thing in Finnish.');

  const score = Math.round((covered / points.length) * 4 + (lengthOk ? 1 : 0));
  return { words, lengthOk, points, score: Math.max(0, Math.min(5, score)), tips };
}
