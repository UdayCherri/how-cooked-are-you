import type { Request, Response } from "express";
import { QUESTIONS } from "../data/questions";

export function listQuestions(_req: Request, res: Response) {
  const sanitized = QUESTIONS.map((q) => ({
    id: q.id,
    prompt: q.prompt,
    choices: q.choices.map((c) => ({ id: c.id, label: c.label })),
  }));
  res.json({ count: sanitized.length, questions: sanitized });
}
