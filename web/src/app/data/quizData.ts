import type { ApiAnswer, ApiResult, ApiStats } from "../lib/api";
import { FEATURED_STATS, STAT_DISPLAY, metaFor } from "../lib/archetypeMeta";

export interface Archetype {
  name: string;
  emoji: string;
  description: string;
  tagline: string;
  warning: string;
  color: string;
  bgColor: string;
  diagnosis: string[];
}

export interface QuizResult {
  id: string;
  date: string;
  score: number;
  archetype: Archetype;
  stats: Record<string, number>;
  /** raw backend answers, used for re-analysis / debugging. Optional for shared results. */
  answers: ApiAnswer[];
  /** Backend extras for richer presentation */
  summary: string;
  recoveryPlan: string[];
  warnings: string[];
  observations: string[];
  compatibility: { bestMatch: string; worstMatch: string; rating: number };
}

const DATE_FMT: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

export function formatResultDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", DATE_FMT);
  } catch {
    return iso;
  }
}

function statsForDisplay(stats: ApiStats): Record<string, number> {
  const out: Record<string, number> = {};
  for (const key of FEATURED_STATS) {
    const meta = STAT_DISPLAY[key];
    out[meta.label] = stats[key];
  }
  return out;
}

export function apiResultToQuizResult(api: ApiResult, answers: ApiAnswer[] = []): QuizResult {
  const meta = metaFor(api.archetype);
  const diag = api.diagnostic;
  const warningText = diag.warnings[0] ?? diag.tagline;

  return {
    id: api.id,
    date: formatResultDate(api.createdAt),
    score: api.cookedPercentage,
    archetype: {
      name: api.archetype,
      emoji: meta.emoji,
      color: meta.color,
      bgColor: meta.bgColor,
      tagline: diag.tagline,
      description: diag.summary,
      warning: warningText,
      diagnosis: diag.observations.slice(0, 3),
    },
    stats: statsForDisplay(api.stats),
    answers,
    summary: diag.summary,
    recoveryPlan: diag.recoveryPlan,
    warnings: diag.warnings,
    observations: diag.observations,
    compatibility: diag.compatibility,
  };
}
