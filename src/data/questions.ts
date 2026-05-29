import type { Question } from "../types/domain";

// 8 primary questions. The machine asks, interrupts itself, and grows suspicious.
// Each choice nudges multiple hidden stats and may emit archetype tags (which
// must correspond to real archetype `tag` values in archetypes.ts).
export const QUESTIONS: Question[] = [
  {
    id: "q_projects",
    prompt: "How many unfinished projects are currently haunting you?",
    machineNote: "The machine already knows. It is asking to watch you lie.",
    choices: [
      {
        id: "a",
        label: "Zero. I finish what I start. (The machine does not believe you.)",
        weights: { emotionalStability: 25, productivityIllusion: 10, delusion: 8 },
        archetypeTags: ["npc-arc"],
      },
      {
        id: "b",
        label: "Three or four. They're 'on pause'. Indefinitely.",
        weights: { productivityIllusion: 28, delusion: 14, cooked: 8 },
        archetypeTags: ["productivity-liar"],
      },
      {
        id: "c",
        label: "I stopped counting. There's a graveyard. It has a name.",
        weights: { chaos: 24, goblinEnergy: 18, cooked: 16, productivityIllusion: 12 },
        archetypeTags: ["side-quester", "chaos-agent"],
      },
      {
        id: "d",
        label: "I started a new one to avoid thinking about this question.",
        weights: { chaos: 30, delusion: 16, cooked: 18, mainCharacterSyndrome: 10 },
        archetypeTags: ["side-quester"],
      },
    ],
  },
  {
    id: "q_sleep",
    prompt: "Describe your relationship with sleep.",
    choices: [
      {
        id: "a",
        label: "Healthy. 8 hours. A consistent schedule.",
        weights: { emotionalStability: 28, productivityIllusion: 8 },
        archetypeTags: ["npc-arc"],
      },
      {
        id: "b",
        label: "We're seeing other people. It's complicated.",
        weights: { goblinEnergy: 18, chaos: 14, cooked: 10 },
        archetypeTags: ["sleep-gremlin"],
      },
      {
        id: "c",
        label: "I have achieved a new circadian rhythm unknown to science.",
        weights: { goblinEnergy: 26, delusion: 18, cooked: 20, touchGrassDebt: 14 },
        archetypeTags: ["sleep-gremlin", "goblin-mode"],
      },
      {
        id: "d",
        label: "Sleep is a government psyop and I will not comply.",
        weights: { delusion: 30, chaos: 20, cooked: 22, mainCharacterSyndrome: 12 },
        archetypeTags: ["delulu-monarch", "goblin-mode"],
      },
    ],
  },
  {
    id: "q_character",
    prompt: "Which fictional character do you relate to a little too much?",
    choices: [
      {
        id: "a",
        label: "A well-adjusted side character with a stable arc.",
        weights: { emotionalStability: 22, productivityIllusion: 10 },
        archetypeTags: ["npc-arc"],
      },
      {
        id: "b",
        label: "The misunderstood genius nobody appreciated.",
        weights: { mainCharacterSyndrome: 30, delusion: 20, cooked: 12 },
        archetypeTags: ["main-character", "delulu-monarch"],
      },
      {
        id: "c",
        label: "The chaotic gremlin who shows up and ruins the plot.",
        weights: { chaos: 28, goblinEnergy: 22, cooked: 14 },
        archetypeTags: ["chaos-agent", "goblin-mode"],
      },
      {
        id: "d",
        label: "The one who narrates their own life out loud, dramatically.",
        weights: { mainCharacterSyndrome: 32, delusion: 14, touchGrassDebt: 10 },
        archetypeTags: ["main-character"],
      },
    ],
  },
  {
    id: "q_group_project",
    prompt: "A group project assigns you a partner who does nothing. You:",
    choices: [
      {
        id: "a",
        label: "Communicate calmly and redistribute the workload.",
        weights: { emotionalStability: 30, productivityIllusion: 12 },
        archetypeTags: ["npc-arc"],
      },
      {
        id: "b",
        label: "Do it all yourself and bring it up in the group chat forever.",
        weights: { mainCharacterSyndrome: 22, productivityIllusion: 18, cooked: 10 },
        archetypeTags: ["productivity-liar"],
      },
      {
        id: "c",
        label: "Type a 600-word voice memo about it. Send it. Add a part 2.",
        weights: { chaos: 18, mainCharacterSyndrome: 16, cooked: 12 },
        archetypeTags: ["yapper"],
      },
      {
        id: "d",
        label: "Spiral, do nothing, then panic-build it all at 3am.",
        weights: { chaos: 26, goblinEnergy: 20, cooked: 18, delusion: 10 },
        archetypeTags: ["crashout-veteran", "goblin-mode"],
      },
    ],
  },
  {
    id: "q_internet",
    prompt: "Be honest about your internet habits.",
    machineNote: "The machine is reviewing your search history. It has questions.",
    choices: [
      {
        id: "a",
        label: "Moderate. I log off. I have other interests.",
        weights: { emotionalStability: 24, touchGrassDebt: -10 },
        archetypeTags: ["npc-arc"],
      },
      {
        id: "b",
        label: "I have refreshed a dead feed waiting for content to materialize.",
        weights: { goblinEnergy: 20, touchGrassDebt: 22, cooked: 12 },
        archetypeTags: ["doomscroller", "lo-fi-phantom"],
      },
      {
        id: "c",
        label: "I have parasocial relationships I'd defend in court.",
        weights: { delusion: 24, mainCharacterSyndrome: 14, touchGrassDebt: 20, cooked: 14 },
        archetypeTags: ["parasocial-knight", "doomscroller"],
      },
      {
        id: "d",
        label: "My personality is 70% reposts. The other 30% is also reposts.",
        weights: { goblinEnergy: 26, chaos: 16, touchGrassDebt: 24, cooked: 18 },
        archetypeTags: ["doomscroller", "goblin-mode"],
      },
    ],
  },
  {
    id: "q_overthink",
    prompt: "It's 2am. What is your brain doing?",
    choices: [
      {
        id: "a",
        label: "Sleeping. Like a normal, frightening person.",
        weights: { emotionalStability: 30 },
        archetypeTags: ["npc-arc"],
      },
      {
        id: "b",
        label: "Replaying a cringe moment from 2014 in 4K.",
        weights: { delusion: 16, cooked: 14, emotionalStability: -12 },
        archetypeTags: ["overthinker"],
      },
      {
        id: "c",
        label: "Drafting an argument I will never have with someone who's asleep.",
        weights: { mainCharacterSyndrome: 20, delusion: 18, cooked: 14 },
        archetypeTags: ["overthinker", "main-character"],
      },
      {
        id: "d",
        label: "Inventing a personal theory of the universe while reheating food.",
        weights: { delusion: 26, goblinEnergy: 16, chaos: 14, cooked: 16 },
        archetypeTags: ["delulu-monarch", "discord-oracle"],
      },
    ],
  },
  {
    id: "q_procrastinate",
    prompt: "Your preferred method of avoiding something important:",
    choices: [
      {
        id: "a",
        label: "I don't, really. I do the thing. It's done.",
        weights: { emotionalStability: 26, productivityIllusion: 14 },
        archetypeTags: ["npc-arc"],
      },
      {
        id: "b",
        label: "Reorganize my entire life setup instead of doing the one task.",
        weights: { productivityIllusion: 30, chaos: 12, cooked: 10 },
        archetypeTags: ["productivity-liar"],
      },
      {
        id: "c",
        label: "Pick up a brand new 6-hour hobby with great urgency.",
        weights: { chaos: 24, goblinEnergy: 16, productivityIllusion: 16, cooked: 12 },
        archetypeTags: ["side-quester", "chaos-agent"],
      },
      {
        id: "d",
        label: "Lie horizontally and let the dread do its work.",
        weights: { touchGrassDebt: 24, goblinEnergy: 22, cooked: 18, emotionalStability: -10 },
        archetypeTags: ["lo-fi-phantom", "crashout-veteran"],
      },
    ],
  },
  {
    id: "q_coping",
    prompt: "Select your weirdest coping mechanism. The machine won't judge. (It will.)",
    choices: [
      {
        id: "a",
        label: "Talking it out with a person, like a stable adult.",
        weights: { emotionalStability: 28 },
        archetypeTags: ["npc-arc"],
      },
      {
        id: "b",
        label: "Narrating my misery to my pet in a podcast voice.",
        weights: { mainCharacterSyndrome: 24, goblinEnergy: 14, cooked: 12 },
        archetypeTags: ["yapper", "main-character"],
      },
      {
        id: "c",
        label: "Aggressively rearranging furniture at unholy hours.",
        weights: { chaos: 26, goblinEnergy: 18, cooked: 14 },
        archetypeTags: ["chaos-agent", "goblin-mode"],
      },
      {
        id: "d",
        label: "Having a tiny scheduled crashout, then carrying on like nothing happened.",
        weights: { chaos: 22, delusion: 16, cooked: 18, emotionalStability: -14 },
        archetypeTags: ["crashout-veteran"],
      },
    ],
  },
];

export const QUESTIONS_BY_ID: Map<string, Question> = new Map(QUESTIONS.map((q) => [q.id, q]));
