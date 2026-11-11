export type Lang = 'fi' | 'en';

const CONTRACTIONS: [RegExp, string][] = [
  [/\bi'm\b/g, 'i am'],
  [/\byou're\b/g, 'you are'],
  [/\bwe're\b/g, 'we are'],
  [/\bthey're\b/g, 'they are'],
  [/\bhe's\b/g, 'he is'],
  [/\bshe's\b/g, 'she is'],
  [/\bit's\b/g, 'it is'],
  [/\bwhat's\b/g, 'what is'],
  [/\bwhere's\b/g, 'where is'],
  [/\bthat's\b/g, 'that is'],
  [/\bdon't\b/g, 'do not'],
  [/\bdoesn't\b/g, 'does not'],
  [/\bisn't\b/g, 'is not'],
  [/\baren't\b/g, 'are not'],
  [/\bi'll\b/g, 'i will'],
  [/\bi'd\b/g, 'i would'],
  [/\bcan't\b/g, 'cannot'],
  [/\bcan not\b/g, 'cannot'],
];

export function normalize(s: string, lang: Lang): string {
  let t = s.toLowerCase().replace(/[’‘`´]/g, "'");
  if (lang === 'en') for (const [re, rep] of CONTRACTIONS) t = t.replace(re, rep);
  return t
    .replace(/[.,!?;:"“”()¡¿…–—]/g, ' ')
    .replace(/'/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export const foldUmlauts = (s: string) =>
  s.replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/å/g, 'a');

/** Split a sentence into word tiles (punctuation removed, case kept) */
export function tokenize(s: string): string[] {
  return s
    .replace(/[.,!?;:"“”]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[b.length];
}

export type CheckResult = { correct: boolean; note?: string; expected: string };

export function checkAnswer(
  input: string,
  accepted: string[],
  lang: Lang,
  opts: { strictUmlauts?: boolean; allowTypos?: boolean } = {}
): CheckResult {
  const { strictUmlauts = false, allowTypos = true } = opts;
  const n = normalize(input, lang);
  const expected = accepted[0];
  if (!n) return { correct: false, expected };

  for (const a of accepted) if (normalize(a, lang) === n) return { correct: true, expected: a };

  if (lang === 'fi' && !strictUmlauts) {
    for (const a of accepted) {
      if (foldUmlauts(normalize(a, lang)) === foldUmlauts(n)) {
        return { correct: true, expected: a, note: `Mind the ä/ö: ${a}` };
      }
    }
  }

  if (allowTypos) {
    for (const a of accepted) {
      const na = normalize(a, lang);
      // Finnish is stricter: one letter often makes a different word (maksa / maksaa, tapan / tapaan)
      const limit = lang === 'fi' ? (na.length >= 16 ? 2 : na.length >= 9 ? 1 : 0) : na.length >= 12 ? 2 : na.length >= 5 ? 1 : 0;
      if (limit && levenshtein(na, n) <= limit) {
        return { correct: true, expected: a, note: `Small typo — it's “${a}”` };
      }
    }
  }
  return { correct: false, expected };
}
