import { EVENTS } from "../data/events";
import { STAT_SHORT } from "../data/advice";
import type { EventLogEntry, GameEvent, Stat, StatBlock } from "../types/domain";
import type { Rng } from "../lib/rng";

function effectString(effects: GameEvent["effects"]): string {
  const parts: string[] = [];
  for (const [stat, val] of Object.entries(effects)) {
    if (!val) continue;
    const sign = val > 0 ? "+" : "";
    parts.push(`${sign}${val} ${STAT_SHORT[stat as Stat]}`);
  }
  return parts.join(" · ");
}

// Weighted sampling without replacement: pick `count` distinct events, biased by
// each event's `weight` (default 1). Pure function of the supplied rng.
function sampleEvents(rng: Rng, count: number): GameEvent[] {
  const pool = EVENTS.map((e) => ({ e, w: e.weight ?? 1 }));
  const chosen: GameEvent[] = [];
  const n = Math.min(count, pool.length);
  for (let k = 0; k < n; k++) {
    const total = pool.reduce((sum, item) => sum + item.w, 0);
    let r = rng.next() * total;
    let idx = 0;
    for (let i = 0; i < pool.length; i++) {
      r -= pool[i]!.w;
      if (r <= 0) {
        idx = i;
        break;
      }
    }
    chosen.push(pool[idx]!.e);
    pool.splice(idx, 1);
  }
  return chosen;
}

export type EventOutcome = {
  entries: EventLogEntry[];
  // Net stat deltas to apply to the running stat block.
  deltas: Partial<StatBlock>;
};

// 3–5 events fire per run.
export function selectEvents(rng: Rng): EventOutcome {
  const count = 3 + rng.int(3); // 3, 4, or 5
  const chosen = sampleEvents(rng, count);

  const deltas: Partial<StatBlock> = {};
  const entries: EventLogEntry[] = chosen.map((ev) => {
    for (const [stat, val] of Object.entries(ev.effects)) {
      const s = stat as Stat;
      deltas[s] = (deltas[s] ?? 0) + (val ?? 0);
    }
    return {
      id: ev.id,
      title: ev.title,
      narration: ev.narration,
      effect: effectString(ev.effects),
    };
  });

  return { entries, deltas };
}
