import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { getValidated } from "../middleware/validate";
import { score } from "../services/scoring.service";
import { generateDiagnostic } from "../services/diagnostic.service";
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
});

export type AnalyzeBody = z.infer<typeof analyzeBodySchema>;

export async function analyze(req: Request, res: Response, next: NextFunction) {
  try {
    const body = getValidated<AnalyzeBody>(req);
    const randomMode = req.query.random === "1" || body.answers.length === 0;

    const scoringOut = score({
      answers: body.answers,
      yap: body.yap,
      randomMode,
    });

    const diagnostic = generateDiagnostic({
      stats: scoringOut.stats,
      archetypeTitle: scoringOut.archetypeTitle,
      archetypeTag: scoringOut.archetypeTag,
      archetypeTagline: scoringOut.archetypeTagline,
      archetypeBestMatch: scoringOut.archetypeBestMatch,
      archetypeWorstMatch: scoringOut.archetypeWorstMatch,
      rng: scoringOut.rng,
    });

    const saved = await persistResult({
      stats: scoringOut.stats,
      archetypeTitle: scoringOut.archetypeTitle,
      diagnostic,
      answers: body.answers,
      yap: body.yap,
    });

    res.json({
      id: saved.id,
      cookedPercentage: saved.cookedPercentage,
      archetype: saved.archetype,
      stats: saved.stats,
      diagnostic: saved.diagnostic,
      shareUrl: `/api/result/${saved.id}`,
      createdAt: saved.createdAt,
      randomMode,
    });
  } catch (err) {
    next(err);
  }
}
