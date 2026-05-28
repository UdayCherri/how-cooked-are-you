export const STATS = [
  "cookedPercentage",
  "delusionIndex",
  "brainRotSeverity",
  "npcEnergy",
  "mainCharacterSyndrome",
  "sleepDebt",
  "goblinModeRisk",
  "touchGrassRequirement",
  "emotionalWifiStrength",
] as const;

export type Stat = (typeof STATS)[number];

export type StatBlock = Record<Stat, number>;

export type Choice = {
  id: string;
  label: string;
  weights: Partial<Record<Stat, number>>;
  archetypeTags?: string[];
};

export type Question = {
  id: string;
  prompt: string;
  choices: Choice[];
};

export type Answer = { qid: string; choiceId: string };

export type Archetype = {
  tag: string;
  title: string;
  tagline: string;
  flavor: string;
  bestMatchTag: string;
  worstMatchTag: string;
};

export type Diagnostic = {
  title: string;
  tagline: string;
  summary: string;
  recoveryPlan: string[];
  warnings: string[];
  observations: string[];
  compatibility: {
    bestMatch: string;
    worstMatch: string;
    rating: number;
  };
};

export type AnalyzeResult = {
  id: string;
  cookedPercentage: number;
  archetype: string;
  stats: StatBlock;
  diagnostic: Diagnostic;
  createdAt: string;
};
