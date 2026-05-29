import type { Stat } from "../types/domain";

// Human-readable labels for the 8 hidden stats.
export const STAT_DISPLAY: Record<Stat, string> = {
  cooked: "Cooked Level",
  chaos: "Chaos",
  delusion: "Delusion",
  goblinEnergy: "Goblin Energy",
  mainCharacterSyndrome: "Main Character Syndrome",
  emotionalStability: "Emotional Stability",
  touchGrassDebt: "Touch Grass Debt",
  productivityIllusion: "Productivity Illusion",
};

// Short labels for compact contexts (event log effect strings, battle deltas).
export const STAT_SHORT: Record<Stat, string> = {
  cooked: "Cooked",
  chaos: "Chaos",
  delusion: "Delusion",
  goblinEnergy: "Goblin",
  mainCharacterSyndrome: "MCS",
  emotionalStability: "Stability",
  touchGrassDebt: "Grass Debt",
  productivityIllusion: "Fake Productivity",
};

export const ADJECTIVES: string[] = [
  "concerning",
  "biblical",
  "post-ironic",
  "ambient",
  "feral",
  "load-bearing",
  "low-key catastrophic",
  "respectfully unhinged",
  "internet-poisoned",
  "structurally compromised",
  "deeply parasocial",
  "weapons-grade",
  "softly apocalyptic",
  "richly fermented",
  "industrial-strength",
  "artisanal",
  "clinically fascinating",
  "aggressively casual",
  "unsupervised",
  "spiritually offline",
];

export const NOUNS: string[] = [
  "brain rot",
  "main character syndrome",
  "lore",
  "delusion",
  "goblin behavior",
  "tab dependency",
  "yap energy",
  "ambient dread",
  "emotional buffering",
  "screen poisoning",
  "lo-fi crashout",
  "internet damage",
  "feral confidence",
  "vibe debt",
  "chaos surplus",
  "productivity cosplay",
  "sleep bankruptcy",
  "parasocial firmware",
  "side-quest addiction",
  "untreated main-character-itis",
];

// {{slots}}: adj, noun, statName, statValue, cookedPct, archetype, boss
export const SUMMARY_TEMPLATES: string[] = [
  "The machine has reached a verdict. You present with {{adj}} levels of {{noun}}, a {{statName}} reading of {{statValue}}, and the unmistakable aura of a {{archetype}}. Final cooked level: {{cookedPct}}%. {{boss}} could not fully explain you either.",
  "Diagnosis complete: {{archetype}}, late stage. Your {{statName}} is sitting at {{statValue}} and your {{noun}} is, frankly, {{adj}}. You survived an encounter with {{boss}} and emerged {{cookedPct}}% cooked. We are not mad. We are fascinated.",
  "After {{adj}} deliberation, the diagnostic machine classifies you as a {{archetype}} running on pure {{noun}}. {{statName}}: {{statValue}}. Cooked level: {{cookedPct}}%. {{boss}} has logged you as 'a situation'.",
  "Scan returned {{adj}} {{noun}}, a {{statName}} of {{statValue}}, and the faint smell of an unplugged router. You are a {{archetype}}. {{boss}} tried to intervene and failed. You are {{cookedPct}}% cooked and weirdly thriving.",
  "Your readings are like a poem written by someone who hasn't slept since the second Obama term. {{statName}} at {{statValue}}, {{noun}} {{adj}} and rising, {{archetype}} energy off the charts. {{boss}} blinked first. Cooked level: {{cookedPct}}%.",
  "The machine wishes to note, for the record, that it has seen a lot, and you are still {{adj}}. {{archetype}} confirmed. {{statName}}: {{statValue}}. {{noun}}: present and accounted for. {{cookedPct}}% cooked. {{boss}} sends its regards.",
  "Preliminary findings: {{adj}} {{noun}}, structurally significant {{statName}} ({{statValue}}), and a {{archetype}} silhouette visible from orbit. You faced {{boss}} and did not improve. Cooked level holds at {{cookedPct}}%.",
  "You are operating on {{noun}} and the structural integrity of a single playlist. The {{archetype}} archetype is louder than usual today, your {{statName}} reads {{statValue}}, and {{boss}} has stopped asking questions. {{cookedPct}}% cooked. The vibes are present.",
];
