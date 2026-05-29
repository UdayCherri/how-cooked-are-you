# Sample API Responses

Real outputs captured from a running server. The diagnostic pipeline is a pure
function of its seed, so passing an explicit `seed` (as below) reproduces the
exact same report every time.

---

## `GET /api/health`

```json
{
  "ok": true,
  "service": "how-cooked-are-you",
  "version": "1.0.0",
  "uptimeSec": 1,
  "timestamp": "2026-05-29T10:12:47.340Z"
}
```

---

## `GET /api/questions`

8 primary questions, 4 choices each (truncated to the first question here).

```json
{
  "count": 8,
  "questions": [
    {
      "id": "q_projects",
      "prompt": "How many unfinished projects are currently haunting you?",
      "machineNote": "The machine already knows. It is asking to watch you lie.",
      "choices": [
        {
          "id": "a",
          "label": "Zero. I finish what I start. (The machine does not believe you.)"
        },
        {
          "id": "b",
          "label": "Three or four. They're 'on pause'. Indefinitely."
        },
        {
          "id": "c",
          "label": "I stopped counting. There's a graveyard. It has a name."
        },
        {
          "id": "d",
          "label": "I started a new one to avoid thinking about this question."
        }
      ]
    }
  ]
}
```

---

## `POST /api/analyze`

Request:

```json
{
  "answers": [
    { "qid": "q_projects", "choiceId": "c" },
    { "qid": "q_sleep", "choiceId": "d" },
    { "qid": "q_character", "choiceId": "c" },
    { "qid": "q_group_project", "choiceId": "d" },
    { "qid": "q_internet", "choiceId": "d" },
    { "qid": "q_overthink", "choiceId": "d" },
    { "qid": "q_procrastinate", "choiceId": "d" },
    { "qid": "q_coping", "choiceId": "c" }
  ],
  "yap": "i havent slept in THREE days and the microwave just WINKED at me!!!",
  "seed": 424242
}
```

Response (3–5 random events fired, one boss encounter, achievements unlocked):

```json
{
  "id": "ReGzFoeFdb",
  "cookedPercentage": 81,
  "archetype": "Full Goblin Mode",
  "archetypeEmoji": "👺",
  "stats": {
    "cooked": 100,
    "chaos": 94,
    "delusion": 79,
    "goblinEnergy": 85,
    "mainCharacterSyndrome": 21,
    "emotionalStability": 0,
    "touchGrassDebt": 81,
    "productivityIllusion": 49
  },
  "diagnostic": {
    "title": "Full Goblin Mode",
    "tagline": "the sun has filed a missing person report on you",
    "summary": "You are operating on internet damage and the structural integrity of a single playlist. The Full Goblin Mode archetype is louder than usual today, your Chaos reads 94, and The Eternal Doomscroller has stopped asking questions. 81% cooked. The vibes are present.",
    "fakeDiagnosis": "Doom-Productivity Fusion. Resting and working simultaneously achieved. Neither real.",
    "evidence": [
      "You have responded to stress by buying something small you did not need. The box is still unopened.",
      "You have said 'I'll start Monday' on a day that was not, and would never be, Sunday.",
      "You have refreshed a page that had no reason to update, hoping for a small miracle.",
      "You have said 'I'm almost done' from a point that was not almost done."
    ],
    "warnings": [
      "Has a 'misc' folder containing all the actually important files.",
      "Will leave an event early to be alone, then feel lonely about it.",
      "Should not be trusted with the aux cord after 11pm."
    ],
    "cautions": [
      "NOTICE: TOUCHING GRASS NOT ATTEMPTED IN RECORDED HISTORY",
      "WARNING: DRAFTS FOLDER STRUCTURALLY UNSTABLE. EVACUATE FEELINGS"
    ],
    "observations": [
      "You have an alarm labeled with a threat to your future self.",
      "You have practiced a casual 'oh hey' for a run-in that will never happen.",
      "You have done your best thinking in the shower and your worst follow-through after."
    ],
    "recommendations": [
      "Set the comfort show aside and sit with a single thought for a whole minute.",
      "Open a window. Briefly. The outside world is still operational.",
      "Leave one social event while you're still enjoying it. Foreign concept. Try it."
    ],
    "compatibility": {
      "bestMatch": "Nocturnal Snack Goblin",
      "worstMatch": "Touch Grass Fugitive",
      "rating": 67
    },
    "events": [
      {
        "id": "ev_productivity_investigation",
        "title": "Productivity Investigation",
        "narration": "Investigators examine your '14 open projects.' None are finished. All are described, by you, as 'basically done.'",
        "effect": "+18 Fake Productivity · +8 Chaos · +6 Cooked"
      },
      {
        "id": "ev_delusion_check",
        "title": "Emergency Delusion Check",
        "narration": "The machine runs an emergency delusion check. Your confidence levels are found to be 'structurally unsupported but admirable.'",
        "effect": "+18 Delusion · +8 MCS"
      },
      {
        "id": "ev_reorganize_instead",
        "title": "Strategic Reorganization",
        "narration": "Faced with one important task, you have instead reorganized your entire digital life. The folders are immaculate. The task is untouched.",
        "effect": "+18 Fake Productivity · +8 Delusion"
      }
    ],
    "boss": {
      "id": "boss_doomscroller",
      "name": "The Eternal Doomscroller",
      "title": "Lord of the Bottomless Feed",
      "intro": "A thumb of immense power descends, scrolling a feed that has no end and no joy, only more.",
      "taunt": "'just one more scroll,' it intones, and the sun sets and rises and sets again.",
      "verdict": "You scrolled alongside the Doomscroller until you both forgot what you were looking for. United in the void. Touch grass debt: maxed."
    },
    "achievements": [
      {
        "id": "ach_touch_grass_pending",
        "title": "Touch Grass Pending",
        "emoji": "🌱",
        "description": "Touch Grass Debt above 70. The outdoors misses you. Allegedly."
      },
      {
        "id": "ach_certified_menace",
        "title": "Certified Menace",
        "emoji": "😈",
        "description": "Chaos above 75. You are not the problem. You are simply always present for it."
      },
      {
        "id": "ach_full_goblin",
        "title": "Goblin Mode: Engaged",
        "emoji": "👺",
        "description": "Goblin Energy above 80. The mugs have formed a small society in your room."
      },
      {
        "id": "ach_emotionally_buffering",
        "title": "Emotionally Buffering",
        "emoji": "📶",
        "description": "Emotional Stability below 25. Feelings loading at 2%. Please hold."
      },
      {
        "id": "ach_another_side_project",
        "title": "Built Another Side Project",
        "emoji": "🛠️",
        "description": "Confessed to a graveyard of unfinished projects. The graveyard grows."
      },
      {
        "id": "ach_chaos_speedrun",
        "title": "Chaos Any%",
        "emoji": "🏃",
        "description": "Picked the most unhinged option on 3+ questions. Speedran to cooked."
      },
      {
        "id": "ach_triple_threat",
        "title": "Triple Threat",
        "emoji": "🎯",
        "description": "Chaos, Delusion, and Goblin Energy all above 60. A balanced disaster."
      },
      {
        "id": "ach_fully_cooked_combo",
        "title": "Five-Alarm Situation",
        "emoji": "🚨",
        "description": "Cooked 80%+ with Emotional Stability under 30. Call someone. Maybe."
      },
      {
        "id": "ach_delulu_solabsolu",
        "title": "Delulu Is the Solulu",
        "emoji": "✨",
        "description": "Delusion above 70 with Cooked above 70. The vision is, against all odds, the plan."
      },
      {
        "id": "ach_goblin_royalty",
        "title": "Goblin Royalty",
        "emoji": "🪙",
        "description": "Goblin Energy and Touch Grass Debt both above 70. A monarch of the indoors."
      },
      {
        "id": "ach_sleep_is_psyop",
        "title": "Sleep Truther",
        "emoji": "🌙",
        "description": "Declared sleep a government psyop. The machine has notified no one."
      },
      {
        "id": "ach_floor_dweller",
        "title": "Horizontal Lifestyle",
        "emoji": "🛌",
        "description": "Chose to lie down and let the dread do its work. Respectable."
      },
      {
        "id": "ach_furniture_rearranger",
        "title": "Nocturnal Interior Designer",
        "emoji": "🪑",
        "description": "Coped by rearranging furniture at unholy hours. The room is different now."
      },
      {
        "id": "ach_repost_personality",
        "title": "70% Reposts",
        "emoji": "🔁",
        "description": "Admitted your personality is mostly reposts. The other 30% is also reposts."
      },
      {
        "id": "ach_microwave_thinker",
        "title": "Microwave Philosopher",
        "emoji": "🍜",
        "description": "Invented a theory of the universe while reheating food. Nobel pending."
      },
      {
        "id": "ach_3am_builder",
        "title": "Panic-Built at 3AM",
        "emoji": "🌃",
        "description": "Spiraled, did nothing, then constructed everything at 3am. A classic."
      },
      {
        "id": "ach_archetype_goblin",
        "title": "Achievement Unlocked: Goblin",
        "emoji": "🟢",
        "description": "Your final archetype was Full Goblin Mode. The transformation is complete."
      },
      {
        "id": "ach_completionist",
        "title": "Answered Everything",
        "emoji": "✅",
        "description": "Answered all 8 questions without bailing into random mode. Dedication."
      }
    ]
  },
  "seed": 424242,
  "shareUrl": "/api/result/ReGzFoeFdb",
  "createdAt": "2026-05-29T10:12:47.449Z",
  "randomMode": false
}
```

---

## `GET /api/result/:id`

Returns the byte-identical stored report for `ReGzFoeFdb` (same shape as the
`analyze` response above, minus the `shareUrl`/`randomMode` envelope fields).

---

## `POST /api/battle`

Compares two stored reports. Request:

```json
{ "a": "ReGzFoeFdb", "b": "dHHTlYGj5o" }
```

Response:

```json
{
  "a": {
    "id": "ReGzFoeFdb",
    "archetype": "Full Goblin Mode",
    "cookedPercentage": 81,
    "power": 379
  },
  "b": {
    "id": "dHHTlYGj5o",
    "archetype": "Suspiciously Functional NPC",
    "cookedPercentage": 22,
    "power": -6
  },
  "tie": false,
  "winnerId": "ReGzFoeFdb",
  "loserId": "dHHTlYGj5o",
  "statComparison": [
    {
      "stat": "cooked",
      "label": "Cooked Level",
      "a": 100,
      "b": 26,
      "diff": 74
    },
    {
      "stat": "chaos",
      "label": "Chaos",
      "a": 94,
      "b": 20,
      "diff": 74
    },
    {
      "stat": "delusion",
      "label": "Delusion",
      "a": 79,
      "b": 20,
      "diff": 59
    },
    {
      "stat": "goblinEnergy",
      "label": "Goblin Energy",
      "a": 85,
      "b": 0,
      "diff": 85
    },
    {
      "stat": "mainCharacterSyndrome",
      "label": "Main Character Syndrome",
      "a": 21,
      "b": 16,
      "diff": 5
    },
    {
      "stat": "emotionalStability",
      "label": "Emotional Stability",
      "a": 0,
      "b": 88,
      "diff": -88
    },
    {
      "stat": "touchGrassDebt",
      "label": "Touch Grass Debt",
      "a": 81,
      "b": 14,
      "diff": 67
    },
    {
      "stat": "productivityIllusion",
      "label": "Productivity Illusion",
      "a": 49,
      "b": 85,
      "diff": -36
    }
  ],
  "biggestGap": {
    "stat": "emotionalStability",
    "label": "Emotional Stability",
    "gap": 88
  },
  "funniestExplanation": "Full Goblin Mode (Full Goblin Mode) overwhelmed Suspiciously Functional NPC (Suspiciously Functional NPC) through sheer, undiluted Goblin Energy. The gap was 85. It was not close. It was barely legal.",
  "battleSummary": "FINAL VERDICT: Full Goblin Mode is more cooked than Suspiciously Functional NPC. The machine recommends neither of them be left unsupervised."
}
```

---

## `GET /api/history?limit=3`

```json
{
  "count": 3,
  "items": [
    {
      "id": "dHHTlYGj5o",
      "archetype": "Suspiciously Functional NPC",
      "cookedPercentage": 22,
      "createdAt": "2026-05-29T10:12:47.490Z"
    },
    {
      "id": "ReGzFoeFdb",
      "archetype": "Full Goblin Mode",
      "cookedPercentage": 81,
      "createdAt": "2026-05-29T10:12:47.449Z"
    },
    {
      "id": "18tJpoPT9E",
      "archetype": "Suspiciously Functional NPC",
      "cookedPercentage": 22,
      "createdAt": "2026-05-29T10:12:10.920Z"
    }
  ]
}
```
