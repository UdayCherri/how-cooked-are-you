import { nanoid } from "nanoid";
import { prisma } from "../lib/prisma";
import { HttpError } from "../middleware/errorHandler";
import type { Answer, AnalyzeResult, Diagnostic, StatBlock } from "../types/domain";

export type PersistInput = {
  stats: StatBlock;
  archetypeTitle: string;
  diagnostic: Diagnostic;
  answers: Answer[];
  yap?: string;
};

export async function persistResult(input: PersistInput): Promise<AnalyzeResult> {
  const id = nanoid(10);
  const row = await prisma.result.create({
    data: {
      id,
      cookedPct: input.stats.cookedPercentage,
      archetype: input.archetypeTitle,
      stats: JSON.stringify(input.stats),
      diagnostic: JSON.stringify(input.diagnostic),
      answers: JSON.stringify(input.answers),
      yap: input.yap ?? null,
    },
  });

  return {
    id: row.id,
    cookedPercentage: row.cookedPct,
    archetype: row.archetype,
    stats: input.stats,
    diagnostic: input.diagnostic,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getResultById(id: string): Promise<AnalyzeResult | null> {
  const row = await prisma.result.findUnique({ where: { id } });
  if (!row) return null;
  let stats: StatBlock;
  let diagnostic: Diagnostic;
  try {
    stats = JSON.parse(row.stats) as StatBlock;
    diagnostic = JSON.parse(row.diagnostic) as Diagnostic;
  } catch {
    throw new HttpError(500, "corrupt_result", "persisted result could not be parsed");
  }
  return {
    id: row.id,
    cookedPercentage: row.cookedPct,
    archetype: row.archetype,
    stats,
    diagnostic,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listRecent(limit = 20): Promise<
  { id: string; archetype: string; cookedPercentage: number; createdAt: string }[]
> {
  const rows = await prisma.result.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { id: true, archetype: true, cookedPct: true, createdAt: true },
  });
  return rows.map((r) => ({
    id: r.id,
    archetype: r.archetype,
    cookedPercentage: r.cookedPct,
    createdAt: r.createdAt.toISOString(),
  }));
}
