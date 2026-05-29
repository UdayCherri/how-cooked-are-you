import { ACHIEVEMENTS } from "../data/achievements";
import type { Achievement, AchievementContext } from "../types/domain";

// Evaluate every achievement predicate against the finished run; any number can
// unlock. Returns the unlocked achievements with their `test` stripped off.
export function unlockAchievements(ctx: AchievementContext): Achievement[] {
  const unlocked: Achievement[] = [];
  for (const def of ACHIEVEMENTS) {
    let ok = false;
    try {
      ok = def.test(ctx);
    } catch {
      ok = false;
    }
    if (ok) {
      unlocked.push({
        id: def.id,
        title: def.title,
        emoji: def.emoji,
        description: def.description,
      });
    }
  }
  return unlocked;
}
