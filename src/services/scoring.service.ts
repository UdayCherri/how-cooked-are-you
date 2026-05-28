import { QUESTIONS, QUESTIONS_BY_ID } from "../data/questions";
import type { Answer, Stat, StatBlock } from "../types/domain";
import { STATS } from "../types/domain";
import { mulberry32, type Rng } from "../lib/rng";
import { seedFromAnswers } from "../utils/seed";
import { clamp, topKey } from "../utils/pick";
import { resolveArchetype } from "../data/archetypes";

const INPUT_STATS: Stat[] = STATS.filter((s) => s !== "cookedPercentage") as Stat[];

const MAX_RAW: Record<Stat, number> = (() => {
  const out = {} as Record<Stat, number>;
  for (const s of STATS) out[s] = 0;
  for (const q of QUESTIONS) {
    for (const stat of INPUT_STATS) {
      let maxForQ = 0;
      for (const c of q.choices) {
        const v = c.weights[stat] ?? 0;
        if (v > maxForQ) maxForQ = v;
      }
      out[stat] += maxForQ;
    }
  }
  out.cookedPercentage = 100;
  return out;
})();

const COOKED_WEIGHTS: Record<Stat, number> = {
  cookedPercentage: 0,
  delusionIndex: 1.2,
  brainRotSeverity: 1.5,
  npcEnergy: 0.6,
  mainCharacterSyndrome: 1.0,
  sleepDebt: 1.1,
  goblinModeRisk: 1.2,
  touchGrassRequirement: 1.3,
  emotionalWifiStrength: -1.6,
};

const EMOJI_REGEX = /\p{Extended_Pictographic}/gu;

function yapBoost(yap: string | undefined): Partial<Record<Stat, number>> {
  if (!yap) return {};
  const text = yap.trim();
  if (!text) return {};
  const len = Math.min(text.length, 2000);
  const lettersOnly = text.replace(/[^A-Za-z]/g, "");
  const capsRatio = lettersOnly.length > 0
    ? (text.match(/[A-Z]/g)?.length ?? 0) / lettersOnly.length
    : 0;
  const emojiCount = (text.match(EMOJI_REGEX) ?? []).length;
  const punctRuns = (text.match(/[!?]{2,}|\.{3,}/g) ?? []).length;

  return {
    brainRotSeverity: Math.round(len / 40 + emojiCount * 4 + punctRuns * 3),
    delusionIndex: Math.round(len / 60 + capsRatio * 30 + punctRuns * 2),
    mainCharacterSyndrome: Math.round(capsRatio * 25 + len / 120),
  };
}

export type ScoringOutput = {
  stats: StatBlock;
  archetypeTitle: string;
  archetypeTag: string;
  archetypeTagline: string;
  archetypeFlavor: string;
  archetypeBestMatch: string;
  archetypeWorstMatch: string;
  rng: Rng;
};

export type ScoringInput = {
  answers: Answer[];
  yap?: string;
  randomMode?: boolean;
};

export function score({ answers, yap, randomMode }: ScoringInput): ScoringOutput {
  const seed = randomMode
    ? (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0
    : seedFromAnswers(answers, yap);
  const rng = mulberry32(seed);

  const raw = {} as Record<Stat, number>;
  for (const s of STATS) raw[s] = 0;
  const tagTally: Record<string, number> = {};

  if (randomMode) {
    for (const stat of INPUT_STATS) {
      raw[stat] = Math.floor(rng.next() * MAX_RAW[stat]);
    }
    for (const c of QUESTIONS.flatMap((q) => q.choices)) {
      for (const tag of c.archetypeTags ?? []) {
        tagTally[tag] = (tagTally[tag] ?? 0) + (rng.next() < 0.15 ? 1 : 0);
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

  const stats = {} as StatBlock;
  for (const s of STATS) stats[s] = 0;
  for (const s of INPUT_STATS) {
    const max = MAX_RAW[s] || 1;
    stats[s] = clamp(Math.round((raw[s] / max) * 100));
  }

  let weighted = 0;
  let weightSum = 0;
  for (const s of INPUT_STATS) {
    const w = COOKED_WEIGHTS[s];
    const contribution = w >= 0 ? stats[s] * w : (100 - stats[s]) * Math.abs(w);
    weighted += contribution;
    weightSum += Math.abs(w);
  }
  stats.cookedPercentage = clamp(Math.round(weighted / weightSum));

  const topTag = topKey(tagTally);
  const archetype = resolveArchetype(topTag);

  return {
    stats,
    archetypeTitle: archetype.title,
    archetypeTag: archetype.tag,
    archetypeTagline: archetype.tagline,
    archetypeFlavor: archetype.flavor,
    archetypeBestMatch: archetype.bestMatchTag,
    archetypeWorstMatch: archetype.worstMatchTag,
    rng,
  };
}
