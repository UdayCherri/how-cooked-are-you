export type ArchetypeMeta = {
  emoji: string;
  color: string;
  bgColor: string;
};

const RED = "#FF6B6B";
const YELLOW = "#FFE66D";
const GREEN = "#6BCB77";
const BLUE = "#4D96FF";
const PURPLE = "#B983FF";

const bg = (hex: string, alpha = 0.15) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const ARCHETYPE_META: Record<string, ArchetypeMeta> = {
  "Microwave Philosopher":      { emoji: "🍱", color: PURPLE, bgColor: bg(PURPLE) },
  "Discord Warlock":            { emoji: "🧙", color: BLUE,   bgColor: bg(BLUE)   },
  "Certified Yapper":           { emoji: "🗣️", color: YELLOW, bgColor: bg(YELLOW) },
  "Sleep-Deprived Oracle":      { emoji: "🔮", color: PURPLE, bgColor: bg(PURPLE) },
  "Chronically Online Goblin":  { emoji: "👹", color: GREEN,  bgColor: bg(GREEN)  },
  "Chaotic Neutral Coder":      { emoji: "💻", color: BLUE,   bgColor: bg(BLUE)   },
  "Emotionally Buffering":      { emoji: "🫠", color: YELLOW, bgColor: bg(YELLOW) },
  "Feral Twitter Scholar":      { emoji: "📜", color: RED,    bgColor: bg(RED)    },
  "Lo-fi Doomscroller":         { emoji: "📱", color: RED,    bgColor: bg(RED)    },
  "Ambient Crashout Survivor":  { emoji: "💀", color: PURPLE, bgColor: bg(PURPLE) },
  "Quietly Cooked Civilian":    { emoji: "🫣", color: GREEN,  bgColor: bg(GREEN)  },
};

export const FALLBACK_META: ArchetypeMeta = { emoji: "🍳", color: RED, bgColor: bg(RED) };

export function metaFor(title: string): ArchetypeMeta {
  return ARCHETYPE_META[title] ?? FALLBACK_META;
}

export const STAT_DISPLAY: Record<keyof import("./api").ApiStats, { label: string; emoji: string }> = {
  cookedPercentage:      { label: "Cooked Percentage",       emoji: "🍳" },
  delusionIndex:         { label: "Delusion Index",          emoji: "🌀" },
  brainRotSeverity:      { label: "Brain Rot Severity",      emoji: "🧠" },
  npcEnergy:             { label: "NPC Energy",              emoji: "🤖" },
  mainCharacterSyndrome: { label: "Main Character Syndrome", emoji: "🎭" },
  sleepDebt:             { label: "Sleep Debt",              emoji: "💤" },
  goblinModeRisk:        { label: "Goblin Mode Risk",        emoji: "👹" },
  touchGrassRequirement: { label: "Touch Grass Requirement", emoji: "🌿" },
  emotionalWifiStrength: { label: "Emotional Wifi",          emoji: "📶" },
};

export const FEATURED_STATS: (keyof import("./api").ApiStats)[] = [
  "brainRotSeverity",
  "touchGrassRequirement",
  "mainCharacterSyndrome",
  "sleepDebt",
  "goblinModeRisk",
  "emotionalWifiStrength",
];
