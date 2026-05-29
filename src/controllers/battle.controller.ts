import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { getValidated } from "../middleware/validate";
import { battle } from "../services/battle.service";

export const battleBodySchema = z.object({
  a: z.string().min(4).max(64),
  b: z.string().min(4).max(64),
});

export type BattleBody = z.infer<typeof battleBodySchema>;

export async function postBattle(req: Request, res: Response, next: NextFunction) {
  try {
    const body = getValidated<BattleBody>(req);
    const result = await battle(body.a, body.b);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
