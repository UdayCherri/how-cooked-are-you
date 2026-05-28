import type { Request, Response, NextFunction } from "express";
import { listRecent } from "../services/persistence.service";

export async function getHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const limitRaw = Number(req.query.limit ?? 20);
    const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(50, Math.floor(limitRaw))) : 20;
    const items = await listRecent(limit);
    res.json({ count: items.length, items });
  } catch (err) {
    next(err);
  }
}
