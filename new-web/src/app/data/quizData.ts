export interface Answer {
  text: string;
  cookedness: number;
  emoji: string;
}

export interface Question {
  id: number;
  text: string;
  subtext?: string;
  emoji: string;
  color: string;
  answers: Answer[];
}

export interface Archetype {
  name: string;
  emoji: string;
  description: string;
  warning: string;
  color: string;
  bgColor: string;
  diagnosis: string[];
}

export interface QuizResult {
  id: string;
  date: string;
  score: number;
  archetype: Archetype;
  stats: Record<string, number>;
  answers: number[];
}

export const ARCHETYPES: Archetype[] = [
  {
    name: "Suspiciously Normal",
    emoji: "🕵️",
    description:
      "You function at an almost suspicious level of normality. Either you're an NPC, a LinkedIn influencer, or you're hiding something. We're watching you.",
    warning: "WARNING: May experience extreme FOMO",
    color: "#6BCB77",
    bgColor: "rgba(107, 203, 119, 0.15)",
    diagnosis: [
      "Vitamin D levels: suspiciously healthy",
      "LinkedIn posts per week: 3+",
      "Skill issue: minimal",
    ],
  },
  {
    name: "Slightly Toasted",
    emoji: "🍞",
    description:
      "Society has gotten to you, but you're still functional. You know what a 'work-life balance' is — theoretically. Your Spotify Wrapped is normal-ish.",
    warning: "CAUTION: At risk of becoming a morning person",
    color: "#FFE66D",
    bgColor: "rgba(255, 230, 109, 0.15)",
    diagnosis: [
      "Parasocial relationships: 2–4",
      "Sleep debt: mild",
      "Finsta activity: moderate",
    ],
  },
  {
    name: "Medium Well",
    emoji: "🥩",
    description:
      "You're cooked but in the most relatable way possible. You've sent 'lol' to a crisis text. Your FYP knows you better than your therapist.",
    warning: "ALERT: Touch grass levels critical",
    color: "#4D96FF",
    bgColor: "rgba(77, 150, 255, 0.15)",
    diagnosis: [
      "Brain rot: moderate",
      "Reality grip: loosening",
      "TikTok hours: classified",
    ],
  },
  {
    name: "Well Done",
    emoji: "🔥",
    description:
      "Certified internet brain achieved. You've replaced your personality with your FYP. Your circadian rhythm is a myth. Your phone is an extension of your hand.",
    warning: "CRITICAL: Unplug immediately (you won't)",
    color: "#FF6B6B",
    bgColor: "rgba(255, 107, 107, 0.15)",
    diagnosis: [
      "Main character syndrome: severe",
      "Sleep schedule: fictional",
      "Parasocial bonds: 12+",
    ],
  },
  {
    name: "FULLY COOKED™",
    emoji: "💀",
    description:
      "You are a Certified Internet Goblin. The wifi router IS your home. You've forgotten what trees smell like. You have strong opinions about fictional characters.",
    warning: "⚠️ EMERGENCY: Send help (or don't, we're not your mom)",
    color: "#B983FF",
    bgColor: "rgba(185, 131, 255, 0.15)",
    diagnosis: [
      "Chronically online: irreversible",
      "Reality: optional",
      "Time: a social construct",
    ],
  },
];

export function getArchetype(score: number): Archetype {
  if (score <= 20) return ARCHETYPES[0];
  if (score <= 40) return ARCHETYPES[1];
  if (score <= 60) return ARCHETYPES[2];
  if (score <= 80) return ARCHETYPES[3];
  return ARCHETYPES[4];
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What time do you usually wake up?",
    emoji: "⏰",
    color: "#FFE66D",
    answers: [
      { text: "6 AM. I am a functional member of society.", cookedness: 5, emoji: "🌅" },
      { text: "Noon. The sun can wait.", cookedness: 35, emoji: "😪" },
      { text: "3 PM (it's giving regulated sleep schedule)", cookedness: 65, emoji: "🌙" },
      { text: "'Wake up' implies I slept.", cookedness: 95, emoji: "💀" },
    ],
  },
  {
    id: 2,
    text: "Your phone hits 1% battery. You:",
    emoji: "🔋",
    color: "#FF6B6B",
    answers: [
      { text: "Charge it before it gets below 20%. Always.", cookedness: 5, emoji: "🧠" },
      { text: "Panic and sprint to find a charger", cookedness: 30, emoji: "😰" },
      { text: "Post about it then let it die dramatically", cookedness: 70, emoji: "🎭" },
      { text: "Let it die. As a form of self-care.", cookedness: 95, emoji: "💅" },
    ],
  },
  {
    id: 3,
    text: "Someone important texts you. Your response time is:",
    emoji: "📱",
    color: "#6BCB77",
    answers: [
      { text: "Within 5 minutes. I have basic respect.", cookedness: 5, emoji: "⚡" },
      { text: "A few hours. I was busy (I wasn't).", cookedness: 40, emoji: "🤥" },
      { text: "3 days. Then 'omg sorry just saw this!'", cookedness: 75, emoji: "👻" },
      { text: "I don't. They'll figure it out.", cookedness: 95, emoji: "🦅" },
    ],
  },
  {
    id: 4,
    text: "Your diet mostly consists of:",
    emoji: "🍽️",
    color: "#4D96FF",
    answers: [
      { text: "Meal prepped, portioned, labeled containers", cookedness: 5, emoji: "🥗" },
      { text: "Whatever's in the fridge + mild guilt", cookedness: 35, emoji: "🫙" },
      { text: "Gas station snacks and energy drinks", cookedness: 70, emoji: "⚡" },
      { text: "Sadness. With ranch.", cookedness: 95, emoji: "🫠" },
    ],
  },
  {
    id: 5,
    text: "How many browser tabs do you have open right now?",
    emoji: "💻",
    color: "#B983FF",
    answers: [
      { text: "1–5. I am a professional.", cookedness: 5, emoji: "🏆" },
      { text: "10–20ish. Controlled chaos.", cookedness: 35, emoji: "📊" },
      { text: "47. I know exactly where everything is.", cookedness: 70, emoji: "🗺️" },
      { text: "200+. My laptop is crying. I am not.", cookedness: 97, emoji: "💀" },
    ],
  },
  {
    id: 6,
    text: "Something embarrassing from 2013 surfaces in your memory at midnight:",
    emoji: "😬",
    color: "#FF6B6B",
    answers: [
      { text: "I let it go. That was a different person.", cookedness: 5, emoji: "🧘" },
      { text: "Cringe for a second, shake it off", cookedness: 30, emoji: "😬" },
      { text: "Spiral for 45 mins then forget it happened", cookedness: 65, emoji: "🌀" },
      { text: "Still awake about it on a Tuesday at 4 AM", cookedness: 95, emoji: "😭" },
    ],
  },
  {
    id: 7,
    text: "Your current relationship situation is:",
    emoji: "💔",
    color: "#FFE66D",
    answers: [
      { text: "Stable, healthy, communicative relationship", cookedness: 5, emoji: "💑" },
      { text: "Single, thriving, not looking", cookedness: 20, emoji: "✌️" },
      { text: "It's complicated (2+ situationships, 3 ghosts)", cookedness: 70, emoji: "👻" },
      { text: "Trauma bonded to someone who doesn't know my last name", cookedness: 97, emoji: "🔗" },
    ],
  },
  {
    id: 8,
    text: "At 3 AM you're usually:",
    emoji: "🌙",
    color: "#6BCB77",
    answers: [
      { text: "Asleep. This is the correct answer.", cookedness: 5, emoji: "😴" },
      { text: "Finishing up work, unfortunately", cookedness: 35, emoji: "💼" },
      { text: "Deep in a Wikipedia hole about medieval plagues", cookedness: 70, emoji: "🐀" },
      { text: "Crying to a playlist while ordering food and making life decisions", cookedness: 97, emoji: "💀" },
    ],
  },
  {
    id: 9,
    text: "Your 5-year plan:",
    emoji: "📋",
    color: "#4D96FF",
    answers: [
      { text: "Specific goals, timelines, quarterly reviews", cookedness: 5, emoji: "📈" },
      { text: "Vague vibes and 'being happy'", cookedness: 35, emoji: "🌈" },
      { text: "Surviving. Financially. Emotionally. Barely.", cookedness: 70, emoji: "⚔️" },
      { text: "I don't. The concept of time feels fake.", cookedness: 97, emoji: "🕳️" },
    ],
  },
  {
    id: 10,
    text: "If your brain wrote your honest dating app bio right now:",
    emoji: "🧠",
    color: "#B983FF",
    answers: [
      { text: "'Emotionally available, grounded, ready to love'", cookedness: 5, emoji: "💚" },
      { text: "'Looking for something real. Probably. IDK.'", cookedness: 35, emoji: "🤷" },
      { text: "'Please fix me. I'm fun at parties (I am not at parties).'", cookedness: 70, emoji: "🌡️" },
      { text: "'404: Personality not found. Swipe left for your safety.'", cookedness: 97, emoji: "💀" },
    ],
  },
];

export function calculateScore(selectedCookednesses: number[]): number {
  if (selectedCookednesses.length === 0) return 0;
  const avg = selectedCookednesses.reduce((a, b) => a + b, 0) / selectedCookednesses.length;
  return Math.round(avg);
}

const seededVariance = (base: number, spread: number, seed: number): number => {
  const pseudoRandom = Math.sin(seed * 9301 + 49297) * 0.5 + 0.5;
  return Math.min(100, Math.max(0, Math.round(base + (pseudoRandom - 0.5) * spread)));
};

export function calculateStats(score: number, answers: number[]): Record<string, number> {
  const q0 = answers[0] ?? score;
  const q7 = answers[7] ?? score;
  const sleepBase = ((q0 + q7) / 2) * 0.88;

  return {
    "Brain Rot Level": seededVariance(score * 0.92, 8, score + 1),
    "Touch Grass Urgency": seededVariance(score * 0.88, 12, score + 2),
    "Main Character Energy": seededVariance(Math.min(100, Math.abs(score - 25) * 1.15 + 20), 15, score + 3),
    "Sleep Deprivation Index": seededVariance(sleepBase, 10, score + 4),
    "Chronically Online Rating": seededVariance(score * 0.95, 6, score + 5),
    "Reality Grip Strength": seededVariance((100 - score) * 0.82, 10, score + 6),
  };
}
