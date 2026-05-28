import express from "express";
import cors from "cors";
import { env } from "./lib/env";
import { apiRouter } from "./routes";
import { errorHandler, notFound } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(express.json({ limit: "32kb" }));
  app.use(cors({ origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(",").map((s) => s.trim()) }));

  app.get("/", (_req, res) => {
    res.json({
      service: "how-cooked-are-you",
      tagline: "you are cooked. we can tell you exactly how cooked.",
      docs: "/api/health, /api/questions, /api/analyze, /api/result/:id, /api/history",
    });
  });

  app.use("/api", apiRouter);

  app.use("/api", notFound);
  app.use(errorHandler);

  return app;
}
