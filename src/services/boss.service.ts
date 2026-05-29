import { BOSSES } from "../data/bosses";
import type { Boss, BossEncounter } from "../types/domain";
import type { Rng } from "../lib/rng";

export type BossOutcome = {
  encounter: BossEncounter;
  modifier: Boss["modifier"];
};

// Exactly one boss per run. Returns the player-facing encounter plus the stat
// modifier the engine applies before computing the final cooked percentage.
export function selectBoss(rng: Rng): BossOutcome {
  const boss = rng.pick(BOSSES);
  return {
    encounter: {
      id: boss.id,
      name: boss.name,
      title: boss.title,
      intro: boss.intro,
      taunt: boss.taunt,
      verdict: boss.verdict,
    },
    modifier: boss.modifier,
  };
}
