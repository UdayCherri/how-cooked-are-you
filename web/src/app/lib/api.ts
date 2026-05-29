export type ApiChoice = { id: string; label: string };
export type ApiQuestion = {
  id: string;
  prompt: string;
  /** Occasional machine aside narrated before the question. Flavor only. */
  machineNote?: string;
  choices: ApiChoice[];
};

export type ApiAnswer = { qid: string; choiceId: string };

// The 8 hidden stats the machine secretly tracks. `cooked` is the headline;
// the other 7 form the "character sheet". emotionalStability is inverse
// (higher = healthier).
export type ApiStats = {
  cooked: number;
  chaos: number;
  delusion: number;
  goblinEnergy: number;
  mainCharacterSyndrome: number;
  emotionalStability: number;
  touchGrassDebt: number;
  productivityIllusion: number;
};

export type StatKey = keyof ApiStats;

export type ApiEvent = {
  id: string;
  title: string;
  narration: string;
  /** Human-readable effect summary, e.g. "+18 Chaos · -10 Touch Grass Debt". */
  effect: string;
};

export type ApiBoss = {
  id: string;
  name: string;
  title: string;
  intro: string;
  taunt: string;
  verdict: string;
};

export type ApiAchievement = {
  id: string;
  title: string;
  emoji: string;
  description: string;
};

export type ApiDiagnostic = {
  title: string;
  archetypeEmoji: string;
  tagline: string;
  summary: string;
  fakeDiagnosis: string;
  evidence: string[];
  warnings: string[];
  cautions: string[];
  observations: string[];
  recommendations: string[];
  compatibility: { bestMatch: string; worstMatch: string; rating: number };
  events: ApiEvent[];
  boss: ApiBoss;
  achievements: ApiAchievement[];
};

export type ApiResult = {
  id: string;
  cookedPercentage: number;
  archetype: string;
  archetypeEmoji?: string;
  stats: ApiStats;
  diagnostic: ApiDiagnostic;
  seed?: number;
  shareUrl?: string;
  createdAt: string;
  randomMode?: boolean;
};

export type ApiHistoryItem = {
  id: string;
  archetype: string;
  cookedPercentage: number;
  createdAt: string;
};

// ── Battle mode ─────────────────────────────────────────────────────────────
export type ApiBattleCombatant = {
  id: string;
  archetype: string;
  emoji: string;
  cookedPercentage: number;
  power: number;
};

export type ApiStatComparison = {
  stat: StatKey;
  label: string;
  a: number;
  b: number;
  diff: number;
};

export type ApiBattleResult = {
  a: ApiBattleCombatant;
  b: ApiBattleCombatant;
  tie: boolean;
  winnerId: string | null;
  loserId: string | null;
  statComparison: ApiStatComparison[];
  biggestGap: { stat: StatKey; label: string; gap: number };
  funniestExplanation: string;
  battleSummary: string;
};

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    let code = "request_failed";
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      code = body?.error?.code ?? code;
      message = body?.error?.message ?? message;
    } catch {
      /* non-json body */
    }
    throw new ApiError(res.status, code, message);
  }
  return (await res.json()) as T;
}

export function fetchQuestions(): Promise<{ count: number; questions: ApiQuestion[] }> {
  return request("/api/questions");
}

export function analyzeQuiz(payload: { answers: ApiAnswer[]; yap?: string }): Promise<ApiResult> {
  return request("/api/analyze", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchResultById(id: string): Promise<ApiResult> {
  return request(`/api/result/${encodeURIComponent(id)}`);
}

export function fetchHistory(limit = 20): Promise<{ count: number; items: ApiHistoryItem[] }> {
  return request(`/api/history?limit=${limit}`);
}

export function battleReports(a: string, b: string): Promise<ApiBattleResult> {
  return request("/api/battle", {
    method: "POST",
    body: JSON.stringify({ a, b }),
  });
}
