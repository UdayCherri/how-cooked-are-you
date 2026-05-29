import type {
  Achievement,
  Archetype,
  BossEncounter,
  Diagnostic,
  EventLogEntry,
  Stat,
  StatBlock,
} from "../types/domain";
import type { Rng } from "../lib/rng";
import { ADJECTIVES, NOUNS, STAT_DISPLAY, SUMMARY_TEMPLATES } from "../data/advice";
import { OBSERVATIONS_POOL } from "../data/observations";
import { WARNINGS_POOL } from "../data/warnings";
import { CAUTIONS_POOL } from "../data/cautions";
import { EVIDENCE_POOL } from "../data/evidence";
import { DIAGNOSES_POOL } from "../data/diagnoses";
import { RECOMMENDATIONS_POOL } from "../data/recommendations";
import { ARCHETYPES_BY_TAG, FALLBACK_ARCHETYPE } from "../data/archetypes";
import { pickN } from "../utils/pick";

type TemplateCtx = {
  adj: string;
  noun: string;
  statName: string;
  statValue: number;
  cookedPct: number;
  archetype: string;
  boss: string;
};

// The "signature" stat — highest reading, excluding the headline `cooked`.
function signatureStat(stats: StatBlock): { name: Stat; value: number } {
  let bestName: Stat = "chaos";
  let bestVal = -1;
  for (const [k, v] of Object.entries(stats)) {
    if (k === "cooked") continue;
    if (v > bestVal) {
      bestVal = v;
      bestName = k as Stat;
    }
  }
  return { name: bestName, value: bestVal };
}

function fill(template: string, ctx: TemplateCtx): string {
  return template
    .replace(/\{\{adj\}\}/g, ctx.adj)
    .replace(/\{\{noun\}\}/g, ctx.noun)
    .replace(/\{\{statName\}\}/g, ctx.statName)
    .replace(/\{\{statValue\}\}/g, String(ctx.statValue))
    .replace(/\{\{cookedPct\}\}/g, String(ctx.cookedPct))
    .replace(/\{\{archetype\}\}/g, ctx.archetype)
    .replace(/\{\{boss\}\}/g, ctx.boss);
}

const fillAll = (templates: string[], ctx: TemplateCtx): string[] =>
  templates.map((t) => fill(t, ctx));

export function generateDiagnostic(params: {
  stats: StatBlock;
  cookedPercentage: number;
  archetype: Archetype;
  events: EventLogEntry[];
  boss: BossEncounter;
  achievements: Achievement[];
  rng: Rng;
}): Diagnostic {
  const { stats, cookedPercentage, archetype, events, boss, achievements, rng } = params;
  const top = signatureStat(stats);

  const ctx: TemplateCtx = {
    adj: rng.pick(ADJECTIVES),
    noun: rng.pick(NOUNS),
    statName: STAT_DISPLAY[top.name],
    statValue: top.value,
    cookedPct: cookedPercentage,
    archetype: archetype.title,
    boss: boss.name,
  };

  const summary = fill(rng.pick(SUMMARY_TEMPLATES), ctx);
  const fakeDiagnosis = fill(rng.pick(DIAGNOSES_POOL), ctx);
  const evidence = fillAll(pickN(rng, EVIDENCE_POOL, 4), ctx);
  const warnings = fillAll(pickN(rng, WARNINGS_POOL, 3), ctx);
  const cautions = fillAll(pickN(rng, CAUTIONS_POOL, 2), ctx);
  const observations = fillAll(pickN(rng, OBSERVATIONS_POOL, 3), ctx);
  const recommendations = fillAll(pickN(rng, RECOMMENDATIONS_POOL, 3), ctx);

  const bestArchetype = ARCHETYPES_BY_TAG.get(archetype.bestMatchTag) ?? FALLBACK_ARCHETYPE;
  const worstArchetype = ARCHETYPES_BY_TAG.get(archetype.worstMatchTag) ?? FALLBACK_ARCHETYPE;
  const rating = 40 + rng.int(61); // 40–100

  return {
    title: archetype.title,
    archetypeEmoji: archetype.emoji,
    tagline: archetype.tagline,
    summary,
    fakeDiagnosis,
    evidence,
    warnings,
    cautions,
    observations,
    recommendations,
    compatibility: {
      bestMatch: bestArchetype.title,
      worstMatch: worstArchetype.title,
      rating,
    },
    events,
    boss,
    achievements,
  };
}
