import { getResultById } from "./persistence.service";
import { HttpError } from "../middleware/errorHandler";
import { hashStringToInt } from "../utils/seed";
import { mulberry32 } from "../lib/rng";
import { STATS, type AnalyzeResult, type Stat } from "../types/domain";
import { STAT_DISPLAY } from "../data/advice";
import { BATTLE_EXPLANATIONS, BATTLE_SUMMARIES, BATTLE_TIE } from "../data/battle";

// "Battle power" — a deliberately lopsided measure of how much of a menace you
// are. Stability counts against you.
function battlePower(stats: AnalyzeResult["stats"]): number {
  return (
    stats.cooked +
    stats.chaos +
    stats.goblinEnergy +
    stats.mainCharacterSyndrome +
    stats.delusion -
    stats.emotionalStability
  );
}

type StatComparison = {
  stat: Stat;
  label: string;
  a: number;
  b: number;
  diff: number;
};

export type BattleResult = {
  a: { id: string; archetype: string; emoji: string; cookedPercentage: number; power: number };
  b: { id: string; archetype: string; emoji: string; cookedPercentage: number; power: number };
  tie: boolean;
  winnerId: string | null;
  loserId: string | null;
  statComparison: StatComparison[];
  biggestGap: { stat: Stat; label: string; gap: number };
  funniestExplanation: string;
  battleSummary: string;
};

function fillBattle(
  template: string,
  ctx: Record<string, string | number>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_m, key: string) =>
    key in ctx ? String(ctx[key]) : `{{${key}}}`
  );
}

export async function battle(aId: string, bId: string): Promise<BattleResult> {
  if (aId === bId) {
    throw new HttpError(400, "same_combatant", "a report cannot battle itself (that's just a Tuesday)");
  }
  const [ra, rb] = await Promise.all([getResultById(aId), getResultById(bId)]);
  if (!ra) throw new HttpError(404, "result_not_found", `no diagnostic exists for id "${aId}"`);
  if (!rb) throw new HttpError(404, "result_not_found", `no diagnostic exists for id "${bId}"`);

  const powerA = battlePower(ra.stats);
  const powerB = battlePower(rb.stats);

  // Deterministic narration: seed from both ids so the same matchup always reads
  // the same way.
  const rng = mulberry32(hashStringToInt(`${aId}<>${bId}`));

  const statComparison: StatComparison[] = STATS.map((s) => ({
    stat: s,
    label: STAT_DISPLAY[s],
    a: ra.stats[s],
    b: rb.stats[s],
    diff: ra.stats[s] - rb.stats[s],
  }));

  // The single stat with the largest absolute gap, for the returned data.
  let biggest = statComparison[0]!;
  for (const c of statComparison) {
    if (Math.abs(c.diff) > Math.abs(biggest.diff)) biggest = c;
  }

  // Decide winner: power, tie-broken by cooked percentage.
  let tie = false;
  let winner: AnalyzeResult;
  let loser: AnalyzeResult;
  if (powerA === powerB && ra.cookedPercentage === rb.cookedPercentage) {
    tie = true;
    winner = ra;
    loser = rb;
  } else if (powerA > powerB || (powerA === powerB && ra.cookedPercentage > rb.cookedPercentage)) {
    winner = ra;
    loser = rb;
  } else {
    winner = rb;
    loser = ra;
  }

  // For the narration, reference a stat the winner actually leads on (so the
  // joke isn't backwards). emotionalStability is inverse — leading it makes you
  // *less* cooked — so exclude it from "what made you win". Fall back to cooked %.
  let leadStat = "Cooked Level";
  let leadGap = Math.abs(winner.cookedPercentage - loser.cookedPercentage);
  let bestLead = -Infinity;
  for (const s of STATS) {
    if (s === "emotionalStability") continue;
    const lead = winner.stats[s] - loser.stats[s];
    if (lead > bestLead) {
      bestLead = lead;
      if (lead > 0) {
        leadStat = STAT_DISPLAY[s];
        leadGap = lead;
      }
    }
  }

  const ctx = {
    winner: winner.archetype,
    loser: loser.archetype,
    winnerArch: winner.archetype,
    loserArch: loser.archetype,
    winnerCooked: winner.cookedPercentage,
    loserCooked: loser.cookedPercentage,
    stat: leadStat,
    gap: leadGap,
  };

  const funniestExplanation = tie
    ? fillBattle(rng.pick(BATTLE_TIE), ctx)
    : fillBattle(rng.pick(BATTLE_EXPLANATIONS), ctx);
  const battleSummary = tie
    ? fillBattle(rng.pick(BATTLE_TIE), ctx)
    : fillBattle(rng.pick(BATTLE_SUMMARIES), ctx);

  return {
    a: { id: ra.id, archetype: ra.archetype, emoji: ra.diagnostic.archetypeEmoji ?? "🍳", cookedPercentage: ra.cookedPercentage, power: powerA },
    b: { id: rb.id, archetype: rb.archetype, emoji: rb.diagnostic.archetypeEmoji ?? "🍳", cookedPercentage: rb.cookedPercentage, power: powerB },
    tie,
    winnerId: tie ? null : winner.id,
    loserId: tie ? null : loser.id,
    statComparison,
    biggestGap: { stat: biggest.stat, label: biggest.label, gap: Math.abs(biggest.diff) },
    funniestExplanation,
    battleSummary,
  };
}
