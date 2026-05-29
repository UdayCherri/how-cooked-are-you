import { Router } from "express";
import { health } from "../controllers/health.controller";
import { listQuestions } from "../controllers/questions.controller";
import { analyze, analyzeBodySchema } from "../controllers/analyze.controller";
import { getResult } from "../controllers/result.controller";
import { getHistory } from "../controllers/history.controller";
import { postBattle, battleBodySchema } from "../controllers/battle.controller";
import { validateBody } from "../middleware/validate";
import { analyzeLimiter, generalLimiter } from "../middleware/rateLimit";

export const apiRouter = Router();

apiRouter.get("/health", health);
apiRouter.get("/questions", generalLimiter, listQuestions);
apiRouter.post("/analyze", analyzeLimiter, validateBody(analyzeBodySchema), analyze);
apiRouter.get("/result/:id", generalLimiter, getResult);
apiRouter.get("/history", generalLimiter, getHistory);
apiRouter.post("/battle", analyzeLimiter, validateBody(battleBodySchema), postBattle);
