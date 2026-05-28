import type { Request, Response } from "express";

const startedAt = Date.now();

export function health(_req: Request, res: Response) {
  res.json({
    ok: true,
    service: "how-cooked-are-you",
    version: "1.0.0",
    uptimeSec: Math.round((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
  });
}
