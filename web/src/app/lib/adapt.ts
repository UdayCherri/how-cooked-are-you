// Bridges the bespoke client session and the backend's procedural verdict.
// The session is theater; the backend's /api/analyze is the authoritative result.
import type { ApiAnswer, ApiQuestion, ApiResult } from "./api";
import {
  getArchetype,
  type Achievement,
  type Archetype,
  type EvidenceItem,
  type EvidenceType,
  type GameResult,
} from "../data/gameData";

// What the live session collected, to enrich (but not override) the backend verdict.
export interface SessionData {
  questionAnswers: Record<number, number>;
  evidence: EvidenceItem[];
  bossChoiceIdx: number;
  bossEventId: string | null;
}

// Both decks have 8 questions × 4 choices, ordered chill→cooked, so the
// session's question index / choice index maps positionally onto the backend.
export function toBackendAnswers(
  questionAnswers: Record<number, number>,
  questions: ApiQuestion[]
): ApiAnswer[] {
  const answers: ApiAnswer[] = [];
  questions.forEach((q, i) => {
    const choiceIdx = questionAnswers[i];
    if (choiceIdx == null) return;
    const choice = q.choices[choiceIdx] ?? q.choices[0];
    if (choice) answers.push({ qid: q.id, choiceId: choice.id });
  });
  return answers;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric",
      year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

// Backend archetype identity, dressed in the score-band tier's palette/class.
function archetypeFromApi(api: ApiResult): Archetype {
  const tier = getArchetype(api.cookedPercentage);
  return {
    id: slug(api.archetype),
    name: api.archetype,
    emoji: api.archetypeEmoji ?? api.diagnostic.archetypeEmoji ?? tier.emoji,
    class: tier.class,
    verdict: api.diagnostic.summary || api.diagnostic.fakeDiagnosis || tier.verdict,
    color: tier.color,
    bgColor: tier.bgColor,
    borderColor: tier.borderColor,
  };
}

function achievementsFromApi(api: ApiResult): Achievement[] {
  return api.diagnostic.achievements.map((a) => ({
    id: a.id,
    name: a.title,
    icon: a.emoji,
    description: a.description,
    flavor: a.description,
  }));
}

const EVIDENCE_CYCLE: EvidenceType[] = ["testimony", "behavioral", "exhibit", "critical"];

// Shared/historical results have no live evidence board, so synthesize one from
// the backend's evidence strings.
function evidenceFromApi(api: ApiResult): EvidenceItem[] {
  return api.diagnostic.evidence.map((e, i) => ({
    type: EVIDENCE_CYCLE[i % EVIDENCE_CYCLE.length]!,
    title: e,
    description: "Compiled by the central diagnostic.",
    fromQuestion: i,
  }));
}

// Merge the backend verdict with the (optional) live session into the view-model
// the screens already understand.
export function buildResultFromApi(api: ApiResult, session?: SessionData): GameResult {
  return {
    id: api.id,
    date: formatDate(api.createdAt),
    score: api.cookedPercentage,
    archetype: archetypeFromApi(api),
    evidence: session && session.evidence.length > 0 ? session.evidence : evidenceFromApi(api),
    achievements: achievementsFromApi(api),
    questionAnswers: session?.questionAnswers ?? {},
    bossChoiceIdx: session?.bossChoiceIdx ?? 0,
    bossEventId: session?.bossEventId ?? null,
    shared: !session,
  };
}

export function shareUrlFor(id: string): string {
  if (typeof window === "undefined") return `/r/${id}`;
  return `${window.location.origin}/r/${id}`;
}

// Parse a shared id from the current URL path (/r/:id) or from pasted text.
export function parseSharedId(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  const link = s.match(/\/r\/([A-Za-z0-9_-]{4,64})\/?$/);
  if (link) return link[1]!;
  if (/^[A-Za-z0-9_-]{4,64}$/.test(s)) return s;
  return null;
}
