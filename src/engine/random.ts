export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sample<T>(arr: readonly T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** n unique distractors from pool, excluding anything equal (case-insensitive) to `exclude` */
export function distractors(pool: readonly string[], exclude: string[], n: number): string[] {
  const ex = new Set(exclude.map((s) => s.toLowerCase()));
  const uniq = [...new Set(pool)].filter((s) => !ex.has(s.toLowerCase()));
  return sample(uniq, n);
}
