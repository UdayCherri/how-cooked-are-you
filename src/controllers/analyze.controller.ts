import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { getValidated } from "../middleware/validate";
import { runDiagnostic } from "../services/engine.service";
import { persistResult } from "../services/persistence.service";

export const analyzeBodySchema = z.object({
  answers: z
    .array(
      z.object({
        qid: z.string().min(1).max(64),
        choiceId: z.string().min(1).max(8),
      })
    )
    .max(50)
    .default([]),
  yap: z.string().max(2000).optional(),
  // Optional explicit seed for fully reproducible runs (testing / shared links).
  seed: z.number().int().optional(),
});

export type AnalyzeBody = z.infer<typeof analyzeBodySchema>;

export async function analyze(req: Request, res: Response, next: NextFunction) {
  try {
    const body = getValidated<AnalyzeBody>(req);
    const randomMode = req.query.random === "1" || body.answers.length === 0;

    const out = runDiagnostic({
      answers: body.answers,
      yap: body.yap,
      randomMode,
      seed: body.seed,
    });

    const saved = await persistResult({
      stats: out.stats,
      cookedPercentage: out.cookedPercentage,
      archetypeTitle: out.archetype.title,
      diagnostic: out.diagnostic,
      answers: body.answers,
      seed: out.seed,
      yap: body.yap,
    });

    res.json({
      id: saved.id,
      cookedPercentage: saved.cookedPercentage,
      archetype: saved.archetype,
      archetypeEmoji: out.archetype.emoji,
      stats: saved.stats,
      diagnostic: saved.diagnostic,
      seed: saved.seed,
      shareUrl: `/api/result/${saved.id}`,
      createdAt: saved.createdAt,
      randomMode,
    });
  } catch (err) {
    next(err);
  }
}
