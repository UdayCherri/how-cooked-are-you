import type { Answer, Archetype, Diagnostic, Stat, StatBlock } from "../types/domain";
import { STATS } from "../types/domain";
import { mulberry32 } from "../lib/rng";
import type { Rng } from "../lib/rng";
import { seedFromAnswers } from "../utils/seed";
import { clamp } from "../utils/pick";
import { ARCHETYPES, FALLBACK_ARCHETYPE } from "../data/archetypes";
import { computeCookedPercentage, scoreBase } from "./scoring.service";
import { selectEvents } from "./events.service";
import { selectBoss } from "./boss.service";
import { unlockAchievements } from "./achievements.service";
import { generateDiagnostic } from "./diagnostic.service";

export type EngineInput = {
  answers: Answer[];
  yap?: string;
  randomMode?: boolean;
  // Explicit seed forces a fully reproducible run (used for share-link
  // regeneration and determinism tests).
  seed?: number;
};

export type EngineOutput = {
  stats: StatBlock;
  cookedPercentage: number;
  archetype: Archetype;
  diagnostic: Diagnostic;
  seed: number;
};

// Seeds are masked to 31 bits so they always fit a signed 32-bit DB column.
// mulberry32 treats the seed as an opaque bit pattern, so this costs nothing.
const SEED_MASK = 0x7fffffff;

function resolveSeed(input: EngineInput, randomMode: boolean): number {
  if (typeof input.seed === "number" && Number.isFinite(input.seed)) {
    return (input.seed >>> 0) & SEED_MASK;
  }
  if (randomMode) {
    return ((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0) & SEED_MASK;
  }
  // Deterministic base from the answers, XORed with a per-run nonce so that
  // resubmitting the same answers still produces a fresh run. The seed itself
  // is persisted, so regenerating by id stays byte-identical.
  const base = seedFromAnswers(input.answers, input.yap);
  const nonce = Math.floor(Math.random() * 0xffffffff);
  return ((base ^ nonce) >>> 0) & SEED_MASK;
}

// Pick the best-fitting archetype by blending stat affinity with answer-derived
// tag mentions, plus a little seeded jitter to break near-ties for variety.
function selectArchetype(rng: Rng, stats: StatBlock, tagTally: Record<string, number>): Archetype {
  let best: Archetype = FALLBACK_ARCHETYPE;
  let bestScore = -Infinity;
  for (const a of ARCHETYPES) {
    let fit = 0;
    for (const [stat, weight] of Object.entries(a.affinity)) {
      fit += (weight ?? 0) * (stats[stat as Stat] / 100);
    }
    const tagBonus = (tagTally[a.tag] ?? 0) * 60;
    const jitter = rng.next() * 25;
    const score = fit + tagBonus + jitter;
    if (score > bestScore) {
      bestScore = score;
      best = a;
    }
  }
  return best;
}

function applyDeltas(stats: StatBlock, deltas: Partial<StatBlock>): void {
  for (const [stat, val] of Object.entries(deltas)) {
    const s = stat as Stat;
    stats[s] = clamp((stats[s] ?? 0) + (val ?? 0));
  }
}

// The full diagnostic pipeline: score -> events -> boss -> archetype ->
// achievements -> report. Pure function of the resolved seed.
export function runDiagnostic(input: EngineInput): EngineOutput {
  const randomMode = input.randomMode ?? false;
  const seed = resolveSeed(input, randomMode);
  const rng = mulberry32(seed);

  // 1. Base stats from answers (+ yap).
  const { stats, tagTally } = scoreBase({
    answers: input.answers,
    yap: input.yap,
    randomMode,
    rng,
  });

  // 2. Random events shift the stats.
  const eventOutcome = selectEvents(rng);
  applyDeltas(stats, eventOutcome.deltas);

  // 3. The boss imposes a final skew.
  const bossOutcome = selectBoss(rng);
  applyDeltas(stats, bossOutcome.modifier);

  // Re-clamp everything (applyDeltas already clamps, but stay defensive).
  for (const s of STATS) stats[s] = clamp(stats[s]);

  // 4. Headline cooked percentage from the finished block.
  const cookedPercentage = computeCookedPercentage(stats);

  // 5. Archetype.
  const archetype = selectArchetype(rng, stats, tagTally);

  // 6. Achievements (evaluated against the finished run).
  const achievements = unlockAchievements({
    stats,
    cookedPercentage,
    events: eventOutcome.entries,
    boss: bossOutcome.encounter,
    archetype,
    answers: input.answers,
    yap: input.yap,
  });

  // 7. Assemble the report.
  const diagnostic = generateDiagnostic({
    stats,
    cookedPercentage,
    archetype,
    events: eventOutcome.entries,
    boss: bossOutcome.encounter,
    achievements,
    rng,
  });

  return { stats, cookedPercentage, archetype, diagnostic, seed };
}
