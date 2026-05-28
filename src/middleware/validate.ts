import type { Request, Response, NextFunction } from "express";
import type { ZodTypeAny, z } from "zod";

export function validateBody<S extends ZodTypeAny>(schema: S) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return next(parsed.error);
    (req as Request & { validated: z.infer<S> }).validated = parsed.data;
    next();
  };
}

export function getValidated<T>(req: Request): T {
  return (req as Request & { validated: T }).validated;
}
