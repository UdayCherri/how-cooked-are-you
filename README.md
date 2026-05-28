# How Cooked Are You?

> You are cooked. We can tell you exactly how cooked.

A chaotic internet personality diagnostic API. Users answer ~30 absurd multiple-choice questions, optionally paste some unhinged free-text ("yap"), and receive a comedic fake psychological diagnostic complete with a Cooked Percentage, an archetype ("Discord Warlock", "Microwave Philosopher", etc.), and a shareable result ID.

**Backend only.** No frontend in this repo — the API is the product. Bring your own UI.

## Stack

- Node.js 20+ / TypeScript (strict)
- Express 4
- SQLite via Prisma 5
- Zod validation
- `express-rate-limit`, `nanoid`, `cors`, `dotenv`

## Quickstart

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

Server boots at `http://localhost:3000`.

```bash
# health
curl http://localhost:3000/api/health

# list questions
curl http://localhost:3000/api/questions

# analyze (cooked answers + free-text yap)
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"answers":[{"qid":"q_tabs","choiceId":"d"},{"qid":"q_sleep_schedule","choiceId":"d"}],"yap":"i havent slept since tuesday"}'

# random fallback mode (empty answers)
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"answers":[]}'

# fetch by shareable id
curl http://localhost:3000/api/result/<id>

# latest results
curl http://localhost:3000/api/history
```

## Scripts

| Script | What |
|---|---|
| `npm run dev` | Hot-reload dev server via `tsx watch` |
| `npm run build` | Compile TS to `dist/` |
| `npm start` | Run compiled server |
| `npm run db:migrate` | Apply Prisma migrations (dev) |
| `npm run db:deploy` | Apply migrations (prod) |
| `npm run db:seed` | Seed a few sample results |
| `npm run typecheck` | `tsc --noEmit` |

## API

### `GET /api/health`
Liveness probe. Returns `{ ok, service, version, uptimeSec, timestamp }`.

### `GET /api/questions`
Returns the full quiz. Weights are stripped — only `id`, `prompt`, and `choices: [{id, label}]` are exposed.

### `POST /api/analyze`
**Body**
```json
{
  "answers": [{ "qid": "q_tabs", "choiceId": "d" }, ...],
  "yap": "optional free-text up to 2000 chars"
}
```
- Empty `answers` (or `?random=1`) triggers **random fallback mode**.
- Identical inputs produce identical diagnostics (deterministic seeded RNG).
- Yap is heuristically scored on length, caps-density, emoji count, and punctuation chaos — it boosts `delusionIndex`, `brainRotSeverity`, and `mainCharacterSyndrome`.

**Response** — see `sample-responses.md`.

### `GET /api/result/:id`
Fetch a persisted diagnostic by its shareable nanoid.

### `GET /api/history?limit=20`
The last N diagnostics (max 50, default 20), newest first.

## Generated Metrics

All on a 0–100 scale.

- `cookedPercentage` — the headline number, derived from a weighted average of all other stats
- `delusionIndex`
- `brainRotSeverity`
- `npcEnergy`
- `mainCharacterSyndrome`
- `sleepDebt`
- `goblinModeRisk`
- `touchGrassRequirement`
- `emotionalWifiStrength` — inverted: higher = healthier

## Archetypes

Ten titles, plus a "Quietly Cooked Civilian" fallback. Examples:

- **Microwave Philosopher** — your deepest thoughts arrive at 1:42am while reheating leftovers
- **Discord Warlock** — you have logged 14,000 hours in voice chat and zero in sunlight
- **Certified Yapper** — you sent a 9-minute voice memo today and felt fine about it
- **Sleep-Deprived Oracle** — you haven't slept properly since the second Obama term and you can see the future now
- **Chronically Online Goblin** — the sun has filed a missing person report on you
- **Chaotic Neutral Coder** — you have 7 unfinished side projects and 1 functional sleep cycle
- **Emotionally Buffering** — your feelings are loading at 2%
- **Feral Twitter Scholar** — you have cited a tweet in a real argument and you stand by it
- **Lo-fi Doomscroller** — you have learned the entire global news cycle horizontally, in bed
- **Ambient Crashout Survivor** — three crashouts this month and each one improved your life slightly

## Rate Limits

| Endpoint | Window | Limit |
|---|---|---|
| `POST /api/analyze` | 60s | 10 / IP |
| All other `/api/*` | 60s | 60 / IP |

Behind a proxy? `trust proxy` is enabled, so `X-Forwarded-For` is honored.

## Deploy

### Render
1. New Web Service from this repo.
2. Build command: `npm install && npm run build && npm run db:deploy`
3. Start command: `npm start`
4. Env vars: `DATABASE_URL` (SQLite path or use a Render Disk), `NODE_ENV=production`, `CORS_ORIGIN=https://your-frontend.example`.

For persistence across deploys, attach a Render Disk and point `DATABASE_URL` at `file:/var/data/prod.db`.

### Railway
1. New Project → Deploy from repo.
2. Set service variables: `DATABASE_URL=file:./prod.db`, `NODE_ENV=production`, `CORS_ORIGIN=...`.
3. Build: `npm install && npm run build && npm run db:deploy`.
4. Start: `npm start`.

For a persistent volume on Railway, mount one and use `file:/data/prod.db`.

### Fly.io / VPS / etc.
Standard Node 20 deployment. Set the same env vars. Ensure the SQLite file lives on a persisted volume.

## Notes

- **Deterministic**: identical answers produce byte-identical diagnostics. Friends can rerun your answers and get your exact result (minus the new `id`).
- **No LLM calls**. All comedy comes from template pools + a seeded mulberry32 PRNG. Cheap, fast, offline.
- **Sanitized output**: weights and archetype tags are never exposed via the API.

## License

MIT. Be cooked responsibly.
