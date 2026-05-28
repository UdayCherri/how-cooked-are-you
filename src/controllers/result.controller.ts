import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { getResultById } from "../services/persistence.service";
import { HttpError } from "../middleware/errorHandler";

const paramsSchema = z.object({ id: z.string().min(4).max(64) });

export async function getResult(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = paramsSchema.safeParse(req.params);
    if (!parsed.success) throw new HttpError(400, "invalid_id", "id parameter is malformed");
    const row = await getResultById(parsed.data.id);
    if (!row) throw new HttpError(404, "result_not_found", "no diagnostic exists for that id (or it ran away)");
    res.json(row);
  } catch (err) {
    next(err);
  }
}
