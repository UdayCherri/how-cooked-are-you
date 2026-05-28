# How Cooked Are You?

> You are cooked. We can tell you exactly how cooked.

A chaotic internet personality diagnostic — Buzzfeed quiz meets Gen-Z internet chaos. Users answer 30 absurd multiple-choice questions and receive a fully-rendered, comedic, shareable diagnostic with a Cooked Percentage, an archetype (Discord Warlock, Microwave Philosopher, Sleep-Deprived Oracle, etc.), and a chaotic recovery plan.

Full-stack TypeScript app in one repo:

- **Backend:** Node 20 + Express 4 + Prisma 5 + SQLite + Zod
- **Frontend:** React 18 + Vite 6 + Tailwind 4 + Motion (Framer)
- **Deterministic engine:** identical inputs produce identical results, so share links always re-render the same diagnostic.
- **No LLM, no auth, no tracking, no nonsense.**

## Quickstart

```bash
npm install
npm --prefix web install
npm run db:migrate
npm run dev
```

Then open **http://localhost:5173**. Vite dev server proxies `/api/*` to the Express backend at `:3000`.

## Project layout

```
.
├── prisma/                  # schema + migrations + dev.db
├── src/                     # Express backend
│   ├── controllers/         # route handlers
│   ├── data/                # questions, archetypes, comedy pools
│   ├── lib/                 # env, prisma, rng
│   ├── middleware/          # errors, validation, rate limit
│   ├── routes/              # /api/* router
│   ├── services/            # scoring, diagnostic, persistence
│   ├── types/, utils/       # shared types & helpers
│   ├── app.ts               # express app (also serves web/dist in prod)
│   └── server.ts            # entrypoint
└── web/                     # React + Vite frontend
    ├── src/app/
    │   ├── components/      # screens + ShareCard + FloatingStickers
    │   ├── data/quizData.ts # types + API → UI adapter
    │   └── lib/             # api client + archetype display metadata
    ├── index.html
    ├── vite.config.ts       # dev proxy /api → http://localhost:3000
    └── tsconfig.json
```

## Scripts (run from repo root)

| Script | What |
|---|---|
| `npm run dev` | Runs API (`:3000`) + Vite (`:5173`) concurrently with proxy. **Use this for local dev.** |
| `npm run dev:api` | Backend only — hot-reload via tsx watch |
| `npm run dev:web` | Frontend only — Vite dev server |
| `npm run build` | Builds the web bundle into `web/dist/`, then compiles the backend to `dist/` |
| `npm start` | Boots the compiled server. Serves API + `web/dist` static + SPA fallback at port `PORT` (default 3000) |
| `npm run typecheck` | `tsc --noEmit` for both backend and frontend |
| `npm run db:migrate` | Apply Prisma migrations (dev) |
| `npm run db:deploy` | Apply migrations (production) |
| `npm run db:seed` | Seed a few sample results |

## How the app works

1. **Boot** — frontend fetches `GET /api/questions`. If the URL is `/r/<id>`, it also fetches that shared result and jumps straight to the dashboard.
2. **Quiz** — `QuizFlow` renders one question at a time; each answer is `{qid, choiceId}`.
3. **Submit** — answers go to `POST /api/analyze` in parallel with a ~3.2s themed loading animation.
4. **Results** — backend returns `{ id, cookedPercentage, archetype, stats, diagnostic }`. The dashboard runs an animated score reveal, meme-stat cards, recovery plan, observations, compatibility analysis, and a screenshottable share card.
5. **Share** — copying the share link copies `https://yourhost/r/<id>`. Opening that URL on any device re-renders the same diagnostic from the DB.
6. **History** — local results are stored in `localStorage` and listed under "📋 History".

## API reference

All routes are JSON in / JSON out. Errors come back as `{ error: { code, message } }`.

| Method | Path | Notes |
|---|---|---|
| `GET` | `/api/health` | liveness probe |
| `GET` | `/api/questions` | full quiz (weights stripped) |
| `POST` | `/api/analyze` | body: `{ answers: [{qid, choiceId}], yap?: string }` |
| `GET` | `/api/result/:id` | re-fetch a persisted diagnostic |
| `GET` | `/api/history?limit=20` | newest results, max 50, default 20 |

Rate limits: `POST /api/analyze` → 10 req/min/IP. Everything else → 60 req/min/IP.

See `sample-responses.md` for real captured outputs.

## Generated metrics (0–100)

- `cookedPercentage` (headline number — weighted average)
- `delusionIndex`, `brainRotSeverity`, `npcEnergy`, `mainCharacterSyndrome`, `sleepDebt`, `goblinModeRisk`, `touchGrassRequirement`
- `emotionalWifiStrength` (inverted — higher = healthier)

## Archetypes

Ten titles + a "Quietly Cooked Civilian" fallback. Examples: Microwave Philosopher, Discord Warlock, Certified Yapper, Sleep-Deprived Oracle, Chronically Online Goblin, Chaotic Neutral Coder, Emotionally Buffering, Feral Twitter Scholar, Lo-fi Doomscroller, Ambient Crashout Survivor.

Each archetype carries a tagline, comedic flavor text, and best/worst compatibility links.

## Determinism

Same answers + same yap → same diagnostic, byte-for-byte. Seeded `mulberry32` PRNG drives every random-looking decision (which template, which warning, which observation, which compatibility number). Share a result and your friends will see exactly what you saw — modulo a new persisted id.

## Deploy

### Render

1. New Web Service from this repo.
2. **Build command:** `npm install && npm --prefix web install && npm run build && npm run db:deploy`
3. **Start command:** `npm start`
4. **Env vars:**
   - `DATABASE_URL` — e.g. `file:/var/data/prod.db` (attach a Render Disk for persistence)
   - `NODE_ENV=production`
   - `CORS_ORIGIN=*` (or your specific origin)
   - `PORT` is set by Render automatically.

### Railway

1. Deploy from repo → set service variables.
2. **Build:** `npm install && npm --prefix web install && npm run build && npm run db:deploy`
3. **Start:** `npm start`
4. Mount a volume and set `DATABASE_URL=file:/data/prod.db` for persistence.

### Fly.io / generic Node

Same build + start. Make sure the SQLite file lives on a persisted volume. `trust proxy` is already enabled, so rate-limiting honors `X-Forwarded-For`.

## Notes

- The frontend's screen-level components are all custom Figma-Make designs (`LandingPage`, `QuizFlow`, `LoadingScreen`, `ResultsDashboard`, `HistoryScreen`, `ShareCard`, `FloatingStickers`). The Figma-shipped shadcn UI kit was removed because none of the screens used it.
- All comedy is template-driven via a seeded PRNG — no LLM calls, no API costs, sub-50ms responses.
- The backend exposes only sanitized question/choice text — answer weights and archetype tags never leak to the client.

## License

MIT. Be cooked responsibly.
