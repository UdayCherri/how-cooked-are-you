import { QUESTIONS, QUESTIONS_BY_ID } from "../data/questions";
import type { Answer, Stat, StatBlock } from "../types/domain";
import { STATS } from "../types/domain";
import type { Rng } from "../lib/rng";
import { clamp } from "../utils/pick";

// All 8 stats are accumulated from answer weights.
const MAX_RAW: Record<Stat, number> = (() => {
  const out = {} as Record<Stat, number>;
  for (const s of STATS) out[s] = 0;
  for (const q of QUESTIONS) {
    for (const stat of STATS) {
      let maxForQ = 0;
      for (const c of q.choices) {
        const v = c.weights[stat] ?? 0;
        if (v > maxForQ) maxForQ = v;
      }
      out[stat] += maxForQ;
    }
  }
  // Guard against divide-by-zero for any stat with no positive weight anywhere.
  for (const s of STATS) if (out[s] <= 0) out[s] = 100;
  return out;
})();

// How much each stat contributes to the headline cooked percentage.
// `cooked` dominates; `emotionalStability` is inverse (more stable = less cooked).
const COOKED_WEIGHTS: Record<Stat, number> = {
  cooked: 1.6,
  chaos: 1.0,
  delusion: 1.1,
  goblinEnergy: 0.9,
  mainCharacterSyndrome: 0.8,
  emotionalStability: -1.4,
  touchGrassDebt: 1.0,
  productivityIllusion: 0.7,
};

const EMOJI_REGEX = /\p{Extended_Pictographic}/gu;

// The yap box feeds the machine extra ammunition. Longer / louder / more
// punctuated yaps raise chaos, delusion, and main-character readings.
function yapBoost(yap: string | undefined): Partial<Record<Stat, number>> {
  if (!yap) return {};
  const text = yap.trim();
  if (!text) return {};
  const len = Math.min(text.length, 2000);
  const lettersOnly = text.replace(/[^A-Za-z]/g, "");
  const capsRatio =
    lettersOnly.length > 0 ? (text.match(/[A-Z]/g)?.length ?? 0) / lettersOnly.length : 0;
  const emojiCount = (text.match(EMOJI_REGEX) ?? []).length;
  const punctRuns = (text.match(/[!?]{2,}|\.{3,}/g) ?? []).length;

  return {
    chaos: Math.round(len / 40 + emojiCount * 4 + punctRuns * 3),
    delusion: Math.round(len / 60 + capsRatio * 30 + punctRuns * 2),
    mainCharacterSyndrome: Math.round(capsRatio * 25 + len / 120),
    cooked: Math.round(len / 80 + emojiCount * 2),
  };
}

export function emptyStats(): StatBlock {
  const out = {} as StatBlock;
  for (const s of STATS) out[s] = 0;
  return out;
}

// Recompute the headline cooked percentage from the (post-events, post-boss)
// stat block.
export function computeCookedPercentage(stats: StatBlock): number {
  let weighted = 0;
  let weightSum = 0;
  for (const s of STATS) {
    const w = COOKED_WEIGHTS[s];
    const contribution = w >= 0 ? stats[s] * w : (100 - stats[s]) * Math.abs(w);
    weighted += contribution;
    weightSum += Math.abs(w);
  }
  return clamp(Math.round(weighted / weightSum));
}

export type ScoreOutput = {
  stats: StatBlock;
  tagTally: Record<string, number>;
};

// Produces the base 8-stat block (0–100) plus an archetype-tag tally from the
// answers. Events/boss/cookedPercentage are applied later by the engine.
export function scoreBase(args: {
  answers: Answer[];
  yap?: string;
  randomMode: boolean;
  rng: Rng;
}): ScoreOutput {
  const { answers, yap, randomMode, rng } = args;
  const raw = emptyStats();
  const tagTally: Record<string, number> = {};

  if (randomMode) {
    for (const stat of STATS) raw[stat] = Math.floor(rng.next() * MAX_RAW[stat]);
    for (const c of QUESTIONS.flatMap((q) => q.choices)) {
      for (const tag of c.archetypeTags ?? []) {
        tagTally[tag] = (tagTally[tag] ?? 0) + (rng.next() < 0.18 ? 1 : 0);
      }
    }
  } else {
    for (const a of answers) {
      const q = QUESTIONS_BY_ID.get(a.qid);
      if (!q) continue;
      const c = q.choices.find((ch) => ch.id === a.choiceId);
      if (!c) continue;
      for (const [stat, val] of Object.entries(c.weights)) {
        raw[stat as Stat] += val ?? 0;
      }
      for (const tag of c.archetypeTags ?? []) {
        tagTally[tag] = (tagTally[tag] ?? 0) + 1;
      }
    }
    const boost = yapBoost(yap);
    for (const [stat, val] of Object.entries(boost)) {
      raw[stat as Stat] += val ?? 0;
    }
  }

  const stats = emptyStats();
  for (const s of STATS) {
    stats[s] = clamp(Math.round((raw[s] / MAX_RAW[s]) * 100));
  }

  return { stats, tagTally };
}
