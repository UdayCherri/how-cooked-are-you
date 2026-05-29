# How Cooked Are You?

> You are cooked. We can tell you exactly how cooked.

A replayable, browser-based comedy game disguised as a diagnostic machine. A
suspicious machine interrogates you with **8 absurd questions**, interrupts
itself with **random events**, throws **a boss encounter**, secretly tracks **8
hidden stats**, unlocks **achievements**, and assembles a procedurally generated
diagnostic report from large content pools — so two players rarely get the same
result. Then it lets two reports **battle**.

This is not a personality quiz. It's a small indie game with a verdict at the end —
a full-stack experience: a React frontend that makes the machine *feel alive*
sitting on top of the procedural game engine.

- **Stack:** Node 20 + Express 4 + Prisma 5 + SQLite + Zod backend; React 19 + Vite 6
  + `motion` frontend. TypeScript, strict, end to end.
- **Deterministic engine:** the whole pipeline is a pure function of a seed, so a
  saved report always regenerates identically — while fresh runs stay varied.
- **No LLM, no auth, no tracking.** All comedy is template-driven via a seeded PRNG.

## Quickstart (full game)

```bash
npm install
npm run db:migrate     # apply Prisma migrations
npm run db:seed        # optional: a few sample reports to battle against
npm run dev            # API on :3000, web (Vite) on :5173 with /api proxy
```

Open **http://localhost:5173** and take the diagnostic. Or run just the API with
`npm run dev:api` and hit `http://localhost:3000/api/health`. For a production-style
run, `npm run build && npm start` serves the built frontend and the API together
from `http://localhost:3000` (share links like `/r/:id` resolve via SPA fallback).

## The experience

The frontend is a cinematic "diagnostic machine" interrogation, wired to the backend
in a **hybrid** model: the narrated session is curated client-side theater, but the
final verdict is computed by the backend's procedural engine and persisted.

- **A machine that's alive.** An ASCII-faced machine interrogates you with a typewriter
  cadence and shifting expressions (suspicious, judging, glitching…), filling an
  **evidence board** as you answer.
- **Scripted chaos.** A random **scan anomaly** event fires mid-session and a tiered
  **boss confrontation** demands you respond before the final question.
- **Backend verdict.** On completion the answers are sent to `/api/analyze`; your
  score, archetype, and achievements come from the real engine, then reveal in phases
  (assessment → character sheet → evidence board → achievements → actions).
- **Persisted & shareable.** Every run gets a real id — server history, a shareable
  `/r/:id` link that re-opens the case file, and friend battles.
- **Battle mode.** Pit your case file against a past result or a pasted share link; the
  machine declares a winner with a deliberately unscientific verdict.

## Project layout

```
.
├── prisma/                  # schema + migrations + dev.db
├── web/                     # React 18 + Vite frontend (cinematic "machine")
│   └── src/app/
│       ├── components/      # Landing, Session, Results, History, Battle,
│       │                    #   MachineFace, TypewriterText
│       ├── lib/             # api client + backend↔view-model adapter
│       └── data/            # gameData (questions, events, bosses, archetypes)
└── src/                     # Express backend
    ├── controllers/         # thin HTTP handlers (incl. battle)
    ├── data/                # all content pools (see below)
    ├── lib/                 # env, prisma, rng (mulberry32)
    ├── middleware/          # errors, validation, rate limit
    ├── routes/              # /api/* router
    ├── services/            # engine, scoring, events, boss, achievements,
    │                        #   diagnostic (report), battle, persistence
    ├── types/, utils/       # shared types, seed + pick helpers
    ├── app.ts               # express app (also serves web/dist if built)
    └── server.ts            # entrypoint
```

### Content pools (`src/data/`)

| File | Contents |
|---|---|
| `questions.ts` | 8 primary questions, 4 choices each (stat weights + archetype tags) |
| `archetypes.ts` | 50+ archetypes with stat affinity + best/worst matches |
| `events.ts` | 30+ random event cards (3–5 fire per run) |
| `bosses.ts` | 20 bosses (1 per run) |
| `achievements.ts` | 50+ achievements with predicate tests |
| `evidence.ts` | 100+ "evidence" statements |
| `diagnoses.ts` | 50+ fake diagnoses |
| `cautions.ts` | 25+ caution alerts |
| `warnings.ts` / `observations.ts` / `recommendations.ts` | 50+ each |
| `advice.ts` | stat labels, adjectives, nouns, summary templates |
| `battle.ts` | battle-mode humor pools |

## The diagnostic pipeline

Orchestrated by `src/services/engine.service.ts`, a pure function of the seed:

1. **Score** — answer weights (+ a yap-text boost) produce the base 8-stat block.
2. **Events** — 3–5 random event cards fire and shift the stats.
3. **Boss** — one boss imposes a final stat skew.
4. **Cooked %** — the headline number is a weighted blend of the finished block.
5. **Archetype** — chosen by blending stat affinity with answer-derived tags.
6. **Achievements** — every predicate is evaluated against the finished run.
7. **Report** — title, summary, fake diagnosis, evidence, warnings, cautions,
   observations, recommendations, compatibility, event log, boss, achievements.

### Hidden stats (0–100)

`cooked`, `chaos`, `delusion`, `goblinEnergy`, `mainCharacterSyndrome`,
`emotionalStability` (inverse — higher = less cooked), `touchGrassDebt`,
`productivityIllusion`. Players never see raw values; they drive generation.

## API reference

JSON in / JSON out. Errors: `{ error: { code, message } }`.

| Method | Path | Notes |
|---|---|---|
| `GET` | `/api/health` | liveness probe |
| `GET` | `/api/questions` | 8 questions, choices sanitized (weights/tags stripped) |
| `POST` | `/api/analyze` | body: `{ answers: [{qid, choiceId}], yap?, seed? }` → full report |
| `GET` | `/api/result/:id` | re-fetch a persisted report (byte-identical) |
| `GET` | `/api/history?limit=20` | newest results, max 50 |
| `POST` | `/api/battle` | body: `{ a: id, b: id }` → winner/loser, stat comparison, verdict |

- Empty `answers` (or `?random=1`) triggers **random mode** — fully randomized
  stats for a chaotic fallback run.
- Passing an explicit `seed` makes a run fully reproducible (used for tests).
- Rate limits: `POST /api/analyze` and `POST /api/battle` → 10/min/IP; others → 60/min/IP.

See `sample-responses.md` for real captured outputs.

## Determinism & replayability

The entire pipeline is seeded by `mulberry32`. By default the seed is derived
from the answers (FNV-1a) XORed with a per-run nonce, so **resubmitting the same
answers still feels different** — but the resolved seed is persisted alongside
the rendered report, so **`GET /api/result/:id` always returns the same report**.
Pass an explicit `seed` to force exact reproduction.

## Scripts (run from repo root)

| Script | What |
|---|---|
| `npm run dev:api` | Backend only, hot-reload via tsx watch |
| `npm run db:migrate` | Apply Prisma migrations (dev) |
| `npm run db:deploy` | Apply migrations (production) |
| `npm run db:seed` | Seed a few sample reports |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | Compiles the backend to `dist/` (also builds `web/` if present) |
| `npm start` | Boots the compiled server at `PORT` (default 3000) |

## Deploy (API)

Works on Render / Railway / Fly / any Node host:

- **Build:** `npm install && npm run build && npm run db:deploy`
- **Start:** `npm start`
- **Env:** `DATABASE_URL` (e.g. `file:/data/prod.db` on a persisted volume),
  `NODE_ENV=production`, `CORS_ORIGIN`. `PORT` is provided by the platform.
- `trust proxy` is enabled, so rate-limiting honors `X-Forwarded-For`.

## License

MIT. Be cooked responsibly.
