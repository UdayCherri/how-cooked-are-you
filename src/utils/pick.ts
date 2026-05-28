import type { Rng } from "../lib/rng";

export function pickN<T>(rng: Rng, arr: readonly T[], n: number): T[] {
  if (n >= arr.length) return rng.shuffle(arr);
  return rng.shuffle(arr).slice(0, n);
}

export function clamp(n: number, min = 0, max = 100): number {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

export function topKey<K extends string>(tally: Record<K, number>): K | null {
  let bestKey: K | null = null;
  let bestVal = -Infinity;
  for (const k in tally) {
    const v = tally[k];
    if (v > bestVal) {
      bestVal = v;
      bestKey = k as K;
    }
  }
  return bestVal > 0 ? bestKey : null;
}
