import type { Answer } from "../types/domain";

export function hashStringToInt(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

export function seedFromAnswers(answers: Answer[], yap?: string): number {
  const sorted = answers
    .map((a) => `${a.qid}:${a.choiceId}`)
    .sort()
    .join("|");
  const yapNorm = (yap ?? "").trim().toLowerCase();
  return hashStringToInt(`${sorted}#${yapNorm}`);
}
