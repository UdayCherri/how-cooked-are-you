// ──────────────────────────────────────────────────────────────────────────
// Hidden stats — the 8 values the machine secretly tracks while it interrogates
// you. Players never see the raw math; these only ever feed generation.
// ──────────────────────────────────────────────────────────────────────────
export const STATS = [
  "cooked",
  "chaos",
  "delusion",
  "goblinEnergy",
  "mainCharacterSyndrome",
  "emotionalStability",
  "touchGrassDebt",
  "productivityIllusion",
] as const;

export type Stat = (typeof STATS)[number];

export type StatBlock = Record<Stat, number>;

export type StatDelta = Partial<Record<Stat, number>>;

// ── Questions ──────────────────────────────────────────────────────────────
export type Choice = {
  id: string;
  label: string;
  weights: StatDelta;
  archetypeTags?: string[];
};

export type Question = {
  id: string;
  prompt: string;
  // The machine occasionally narrates before it asks. Flavor only.
  machineNote?: string;
  choices: Choice[];
};

export type Answer = { qid: string; choiceId: string };

// ── Archetypes ─────────────────────────────────────────────────────────────
export type Archetype = {
  tag: string;
  title: string;
  emoji: string;
  tagline: string;
  flavor: string;
  // Which stats this archetype "leans" toward. Used to score archetype fit
  // against the final stat block, blended with answer-derived tags.
  affinity: StatDelta;
  bestMatchTag: string;
  worstMatchTag: string;
};

// ── Random events ──────────────────────────────────────────────────────────
export type GameEvent = {
  id: string;
  title: string;
  narration: string;
  effects: StatDelta;
  // Higher weight = more likely to fire. Defaults to 1.
  weight?: number;
};

export type EventLogEntry = {
  id: string;
  title: string;
  narration: string;
  // Human-readable effect summary, e.g. "+18 Chaos · -10 Touch Grass Debt".
  effect: string;
};

// ── Bosses ─────────────────────────────────────────────────────────────────
export type Boss = {
  id: string;
  name: string;
  title: string;
  intro: string;
  taunt: string;
  // Narrated outcome line; may reference how cooked the player ended up.
  verdict: string;
  // Final scoring skew the boss imposes before cookedPercentage is computed.
  modifier: StatDelta;
};

export type BossEncounter = {
  id: string;
  name: string;
  title: string;
  intro: string;
  taunt: string;
  verdict: string;
};

// ── Achievements ───────────────────────────────────────────────────────────
export type AchievementContext = {
  stats: StatBlock;
  cookedPercentage: number;
  events: EventLogEntry[];
  boss: BossEncounter;
  archetype: Archetype;
  answers: Answer[];
  yap?: string;
};

export type AchievementDef = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  // Predicate evaluated against the finished run.
  test: (ctx: AchievementContext) => boolean;
};

export type Achievement = {
  id: string;
  title: string;
  emoji: string;
  description: string;
};

// ── Generated report ───────────────────────────────────────────────────────
export type Diagnostic = {
  title: string;
  // The chosen archetype's emoji, persisted so shared results / battles can show
  // it without re-deriving across all archetypes on the client.
  archetypeEmoji: string;
  tagline: string;
  summary: string;
  fakeDiagnosis: string;
  evidence: string[];
  warnings: string[];
  cautions: string[];
  observations: string[];
  recommendations: string[];
  compatibility: {
    bestMatch: string;
    worstMatch: string;
    rating: number;
  };
  events: EventLogEntry[];
  boss: BossEncounter;
  achievements: Achievement[];
};

export type AnalyzeResult = {
  id: string;
  cookedPercentage: number;
  archetype: string;
  stats: StatBlock;
  diagnostic: Diagnostic;
  seed: number;
  createdAt: string;
};
