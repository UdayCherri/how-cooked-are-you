import express, { type Request, type Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { env } from "./lib/env";
import { apiRouter } from "./routes";
import { errorHandler, notFound } from "./middleware/errorHandler";

const WEB_DIST = path.resolve(process.cwd(), "web", "dist");
const WEB_INDEX = path.join(WEB_DIST, "index.html");

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(express.json({ limit: "32kb" }));
  app.use(
    cors({
      origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(",").map((s) => s.trim()),
    })
  );

  app.use("/api", apiRouter);
  app.use("/api", notFound);

  const hasWebBuild = fs.existsSync(WEB_INDEX);

  if (hasWebBuild) {
    app.use(
      express.static(WEB_DIST, {
        index: false,
        maxAge: "1h",
        setHeaders: (res, filePath) => {
          if (filePath.endsWith(".html")) {
            res.setHeader("Cache-Control", "no-cache");
          }
        },
      })
    );

    // SPA fallback — anything that isn't /api/* serves index.html
    app.get(/^(?!\/api\/).*/, (_req: Request, res: Response) => {
      res.sendFile(WEB_INDEX);
    });
  } else {
    // Dev / API-only mode: return a friendly JSON pointer at /
    app.get("/", (_req, res) => {
      res.json({
        service: "how-cooked-are-you",
        tagline: "you are cooked. we can tell you exactly how cooked.",
        mode: "api-only (no web/dist found)",
        docs: "/api/health, /api/questions, /api/analyze, /api/result/:id, /api/history",
        hint: "run `npm --prefix web run build` to enable the frontend",
      });
    });
  }

  app.use(errorHandler);

  return app;
}
