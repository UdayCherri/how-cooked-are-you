# Sample API Responses

Real outputs captured during local development. Diagnostics are deterministic — same input, same output.

---

## `GET /api/health`

```json
{
  "ok": true,
  "service": "how-cooked-are-you",
  "version": "1.0.0",
  "uptimeSec": 11,
  "timestamp": "2026-05-28T17:04:55.416Z"
}
```

---

## `GET /api/questions` (truncated)

```json
{
  "count": 30,
  "questions": [
    {
      "id": "q_tabs",
      "prompt": "How many browser tabs do you currently have open?",
      "choices": [
        { "id": "a", "label": "1 to 3, like a person with a soul" },
        { "id": "b", "label": "10 to 20, normal goblin behavior" },
        { "id": "c", "label": "50+, several are screaming silently" },
        { "id": "d", "label": "Tabs are now spread across 6 windows and Chrome is begging me to stop" }
      ]
    }
  ]
}
```

---

## `POST /api/analyze` (cooked answers)

**Request**
```json
{
  "answers": [
    { "qid": "q_tabs", "choiceId": "d" },
    { "qid": "q_sleep_schedule", "choiceId": "d" },
    { "qid": "q_dinner", "choiceId": "d" },
    { "qid": "q_grass", "choiceId": "d" },
    { "qid": "q_right_now", "choiceId": "d" }
  ],
  "yap": "I HAVE NOT SLEPT SINCE TUESDAY!!! the microwave is judging me lol"
}
```

**Response**
```json
{
  "id": "SBqQVJ3U44",
  "cookedPercentage": 36,
  "archetype": "Chronically Online Goblin",
  "stats": {
    "cookedPercentage": 36,
    "delusionIndex": 19,
    "brainRotSeverity": 23,
    "npcEnergy": 0,
    "mainCharacterSyndrome": 4,
    "sleepDebt": 32,
    "goblinModeRisk": 27,
    "touchGrassRequirement": 40,
    "emotionalWifiStrength": 0
  },
  "diagnostic": {
    "title": "Chronically Online Goblin",
    "tagline": "the sun has filed a missing person report on you",
    "summary": "Reading the data is like reading a poem written by someone who hasn't slept. Your Touch Grass Requirement is sitting at 40 and your main character syndrome is on the move. Estimated cookedness: 36%.",
    "recoveryPlan": [
      "Stretch for 4 minutes. The bare minimum. You can do 4 minutes.",
      "Schedule one (1) thing that is not a doctor's appointment.",
      "Open your fridge. Throw out the items that have evolved."
    ],
    "warnings": [
      "Tends to confuse self-awareness with personal growth. They are not the same.",
      "May spontaneously begin a new side project mid-conversation."
    ],
    "observations": [
      "You have laughed alone, out loud, at a screen, within the last 90 minutes.",
      "You have opened your phone, forgotten why, and opened it again 4 seconds later.",
      "You speak fluent meme in three dialects but stumble on phone calls."
    ],
    "compatibility": {
      "bestMatch": "Discord Warlock",
      "worstMatch": "Emotionally Buffering",
      "rating": 86
    }
  },
  "shareUrl": "/api/result/SBqQVJ3U44",
  "createdAt": "2026-05-28T17:05:06.941Z",
  "randomMode": false
}
```

---

## `POST /api/analyze` (random fallback mode)

**Request**
```json
{ "answers": [] }
```

**Response (snippet)**
```json
{
  "id": "a7Kf2pX9wQ",
  "cookedPercentage": 50,
  "archetype": "Chronically Online Goblin",
  "diagnostic": {
    "summary": "Your brain has achieved deeply parasocial levels of delusion. The Goblin Mode Risk reading alone (97) would alarm any licensed professional, which is exactly why you haven't seen one. You are 50% cooked and somehow still online.",
    "...": "..."
  },
  "randomMode": true
}
```

---

## `GET /api/result/:id`

Returns the same `id, cookedPercentage, archetype, stats, diagnostic, createdAt` shape as `POST /api/analyze` — no `shareUrl`/`randomMode` echo.

---

## `GET /api/history`

```json
{
  "count": 2,
  "items": [
    { "id": "SgeEgt8_Wb", "archetype": "Chronically Online Goblin", "cookedPercentage": 36, "createdAt": "2026-05-28T17:05:10.881Z" },
    { "id": "SBqQVJ3U44", "archetype": "Chronically Online Goblin", "cookedPercentage": 36, "createdAt": "2026-05-28T17:05:06.941Z" }
  ]
}
```

---

## Validation error

**Request**
```json
{ "answers": "not an array" }
```

**Response** — `HTTP 400`
```json
{
  "error": {
    "code": "validation_error",
    "message": "request did not parse correctly",
    "details": { "answers": ["Expected array, received string"] }
  }
}
```

---

## Rate limit

After 10 successful `POST /api/analyze` requests inside 60s from one IP, subsequent ones return `HTTP 429`:

```json
{ "error": { "code": "rate_limited", "message": "slow down, you are absolutely cooked enough already" } }
```
