import type { Diagnostic, Stat, StatBlock } from "../types/domain";
import type { Rng } from "../lib/rng";
import { ADJECTIVES, NOUNS, RECOVERY_PLAN_POOL, STAT_DISPLAY, SUMMARY_TEMPLATES } from "../data/advice";
import { OBSERVATIONS_POOL } from "../data/observations";
import { WARNINGS_POOL } from "../data/warnings";
import { ARCHETYPES, ARCHETYPES_BY_TAG, FALLBACK_ARCHETYPE } from "../data/archetypes";
import { pickN } from "../utils/pick";

function highestStat(stats: StatBlock): { name: Stat; value: number } {
  let bestName: Stat = "brainRotSeverity";
  let bestVal = -1;
  for (const [k, v] of Object.entries(stats)) {
    if (k === "cookedPercentage" || k === "emotionalWifiStrength") continue;
    if (v > bestVal) {
      bestVal = v;
      bestName = k as Stat;
    }
  }
  return { name: bestName, value: bestVal };
}

function fillTemplate(
  template: string,
  ctx: { adj: string; noun: string; statName: string; statValue: number; cookedPct: number; archetype: string }
): string {
  return template
    .replace(/\{\{adj\}\}/g, ctx.adj)
    .replace(/\{\{noun\}\}/g, ctx.noun)
    .replace(/\{\{statName\}\}/g, ctx.statName)
    .replace(/\{\{statValue\}\}/g, String(ctx.statValue))
    .replace(/\{\{cookedPct\}\}/g, String(ctx.cookedPct))
    .replace(/\{\{archetype\}\}/g, ctx.archetype);
}

export function generateDiagnostic(params: {
  stats: StatBlock;
  archetypeTitle: string;
  archetypeTag: string;
  archetypeTagline: string;
  archetypeBestMatch: string;
  archetypeWorstMatch: string;
  rng: Rng;
}): Diagnostic {
  const { stats, archetypeTitle, archetypeTagline, archetypeBestMatch, archetypeWorstMatch, rng } = params;
  const top = highestStat(stats);

  const ctx = {
    adj: rng.pick(ADJECTIVES),
    noun: rng.pick(NOUNS),
    statName: STAT_DISPLAY[top.name] ?? top.name,
    statValue: top.value,
    cookedPct: stats.cookedPercentage,
    archetype: archetypeTitle,
  };

  const summary = fillTemplate(rng.pick(SUMMARY_TEMPLATES), ctx);
  const recoveryPlan = pickN(rng, RECOVERY_PLAN_POOL, 3);
  const warnings = pickN(rng, WARNINGS_POOL, 2);
  const observations = pickN(rng, OBSERVATIONS_POOL, 3);

  const bestArchetype = ARCHETYPES_BY_TAG.get(archetypeBestMatch) ?? FALLBACK_ARCHETYPE;
  const worstArchetype = ARCHETYPES_BY_TAG.get(archetypeWorstMatch) ?? rng.pick(ARCHETYPES);
  const rating = 40 + rng.int(61);

  return {
    title: archetypeTitle,
    tagline: archetypeTagline,
    summary,
    recoveryPlan,
    warnings,
    observations,
    compatibility: {
      bestMatch: bestArchetype.title,
      worstMatch: worstArchetype.title,
      rating,
    },
  };
}
