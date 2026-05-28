export type ApiChoice = { id: string; label: string };
export type ApiQuestion = { id: string; prompt: string; choices: ApiChoice[] };

export type ApiAnswer = { qid: string; choiceId: string };

export type ApiStats = {
  cookedPercentage: number;
  delusionIndex: number;
  brainRotSeverity: number;
  npcEnergy: number;
  mainCharacterSyndrome: number;
  sleepDebt: number;
  goblinModeRisk: number;
  touchGrassRequirement: number;
  emotionalWifiStrength: number;
};

export type ApiDiagnostic = {
  title: string;
  tagline: string;
  summary: string;
  recoveryPlan: string[];
  warnings: string[];
  observations: string[];
  compatibility: { bestMatch: string; worstMatch: string; rating: number };
};

export type ApiResult = {
  id: string;
  cookedPercentage: number;
  archetype: string;
  stats: ApiStats;
  diagnostic: ApiDiagnostic;
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
