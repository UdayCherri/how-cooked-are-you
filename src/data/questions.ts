import type { Question } from "../types/domain";

export const QUESTIONS: Question[] = [
  {
    id: "q_tabs",
    prompt: "How many browser tabs do you currently have open?",
    choices: [
      { id: "a", label: "1 to 3, like a person with a soul", weights: { emotionalWifiStrength: 20, npcEnergy: 10 } },
      { id: "b", label: "10 to 20, normal goblin behavior", weights: { brainRotSeverity: 8, sleepDebt: 5 } },
      { id: "c", label: "50+, several are screaming silently", weights: { brainRotSeverity: 20, sleepDebt: 15, goblinModeRisk: 10 }, archetypeTags: ["online-goblin", "chaotic-coder"] },
      { id: "d", label: "Tabs are now spread across 6 windows and Chrome is begging me to stop", weights: { brainRotSeverity: 30, sleepDebt: 25, goblinModeRisk: 20, delusionIndex: 10 }, archetypeTags: ["online-goblin", "chaotic-coder"] },
    ],
  },
  {
    id: "q_sleep_schedule",
    prompt: "Your sleep schedule is based on…?",
    choices: [
      { id: "a", label: "The sun, like a normal mammal", weights: { emotionalWifiStrength: 25 } },
      { id: "b", label: "Work or class obligations only", weights: { sleepDebt: 10, npcEnergy: 15 } },
      { id: "c", label: "Vibes, snacks, and one (1) energy drink at 3am", weights: { sleepDebt: 25, delusionIndex: 15, goblinModeRisk: 10 }, archetypeTags: ["sleep-oracle"] },
      { id: "d", label: "I no longer experience the concept of sleep", weights: { sleepDebt: 35, delusionIndex: 25, brainRotSeverity: 15 }, archetypeTags: ["sleep-oracle", "crashout-survivor"] },
    ],
  },
  {
    id: "q_group_project",
    prompt: "Group project apocalypse. What's your move?",
    choices: [
      { id: "a", label: "Take charge, distribute tasks, save everyone", weights: { mainCharacterSyndrome: 20, emotionalWifiStrength: 10 } },
      { id: "b", label: "Silently do the entire thing at 4am the night before", weights: { sleepDebt: 20, npcEnergy: 5, mainCharacterSyndrome: 10 }, archetypeTags: ["emotionally-buffering"] },
      { id: "c", label: "Become geographically and emotionally unreachable", weights: { goblinModeRisk: 20, npcEnergy: 15 }, archetypeTags: ["online-goblin"] },
      { id: "d", label: "Start a coup and rebrand the project entirely", weights: { mainCharacterSyndrome: 25, delusionIndex: 20 }, archetypeTags: ["chaotic-coder"] },
    ],
  },
  {
    id: "q_iiwii",
    prompt: "How often do you say 'it is what it is'?",
    choices: [
      { id: "a", label: "Never. I am alive and I have feelings.", weights: { emotionalWifiStrength: 20 } },
      { id: "b", label: "When it genuinely, structurally, is", weights: { brainRotSeverity: 5 } },
      { id: "c", label: "Multiple times daily, mostly into the void", weights: { brainRotSeverity: 15, npcEnergy: 20 }, archetypeTags: ["doomscroller"] },
      { id: "d", label: "It has replaced most of my vocabulary", weights: { brainRotSeverity: 30, npcEnergy: 30, delusionIndex: 10 }, archetypeTags: ["doomscroller", "emotionally-buffering"] },
    ],
  },
  {
    id: "q_dinner",
    prompt: "Pick the most accurate recent dinner.",
    choices: [
      { id: "a", label: "A balanced meal prepared by a sane human", weights: { emotionalWifiStrength: 25 } },
      { id: "b", label: "Whatever was in the fridge between two slices of bread", weights: { goblinModeRisk: 15, sleepDebt: 5 } },
      { id: "c", label: "Cereal at 11pm. Standing up. In the dark.", weights: { goblinModeRisk: 25, sleepDebt: 15, brainRotSeverity: 10 }, archetypeTags: ["online-goblin"] },
      { id: "d", label: "Hot sauce on cold leftovers while making prolonged eye contact with the wall", weights: { goblinModeRisk: 30, brainRotSeverity: 15, delusionIndex: 10 }, archetypeTags: ["online-goblin", "crashout-survivor"] },
    ],
  },
  {
    id: "q_fictional",
    prompt: "How emotionally attached are you to fictional characters?",
    choices: [
      { id: "a", label: "They're stories. I'm fine.", weights: { emotionalWifiStrength: 20, npcEnergy: 5 } },
      { id: "b", label: "I have favorites and that's normal", weights: { emotionalWifiStrength: 5 } },
      { id: "c", label: "I would die for them and I have considered the logistics", weights: { delusionIndex: 25, mainCharacterSyndrome: 10, brainRotSeverity: 15 }, archetypeTags: ["twitter-scholar"] },
      { id: "d", label: "I maintain a 40-page document defending one of them", weights: { delusionIndex: 40, brainRotSeverity: 25, mainCharacterSyndrome: 15 }, archetypeTags: ["twitter-scholar", "certified-yapper"] },
    ],
  },
  {
    id: "q_side_projects",
    prompt: "Unfinished side projects currently rotting in your head?",
    choices: [
      { id: "a", label: "Zero. I finish what I start, like a wizard.", weights: { emotionalWifiStrength: 20 } },
      { id: "b", label: "One or two, normal human stuff", weights: { brainRotSeverity: 5 } },
      { id: "c", label: "Seven, all started this month, all involve AI somehow", weights: { delusionIndex: 25, sleepDebt: 15, mainCharacterSyndrome: 15 }, archetypeTags: ["chaotic-coder"] },
      { id: "d", label: "I just started a new framework in my head while reading this", weights: { delusionIndex: 40, brainRotSeverity: 25, mainCharacterSyndrome: 30 }, archetypeTags: ["chaotic-coder", "microwave-philosopher"] },
    ],
  },
  {
    id: "q_grass",
    prompt: "Last time you voluntarily touched grass?",
    choices: [
      { id: "a", label: "Today. I am outside right now.", weights: { emotionalWifiStrength: 30 } },
      { id: "b", label: "Recently, like… last week, I think?", weights: { touchGrassRequirement: 10 } },
      { id: "c", label: "I'm honestly not sure grass is still real", weights: { touchGrassRequirement: 30, brainRotSeverity: 20, goblinModeRisk: 15 }, archetypeTags: ["online-goblin"] },
      { id: "d", label: "Grass is a construct invented to sell lawnmowers", weights: { touchGrassRequirement: 40, brainRotSeverity: 30, delusionIndex: 20 }, archetypeTags: ["microwave-philosopher", "online-goblin"] },
    ],
  },
  {
    id: "q_we_need_to_talk",
    prompt: "Your immediate reaction to 'we need to talk' is:",
    choices: [
      { id: "a", label: "Calmly ask what's up", weights: { emotionalWifiStrength: 25 } },
      { id: "b", label: "Mild dread, but still functional", weights: { sleepDebt: 5, delusionIndex: 5 } },
      { id: "c", label: "Spiral for 6 hours preparing every possible defense", weights: { delusionIndex: 25, mainCharacterSyndrome: 15, brainRotSeverity: 10 }, archetypeTags: ["emotionally-buffering"] },
      { id: "d", label: "Fake my own digital death and emigrate", weights: { goblinModeRisk: 30, delusionIndex: 30 }, archetypeTags: ["online-goblin", "emotionally-buffering"] },
    ],
  },
  {
    id: "q_app_muscle",
    prompt: "Which app opens fastest in your muscle memory?",
    choices: [
      { id: "a", label: "Calendar or Notes — I am a freak of nature", weights: { emotionalWifiStrength: 20 } },
      { id: "b", label: "Instagram, like a normal civilian", weights: { brainRotSeverity: 10, npcEnergy: 10 } },
      { id: "c", label: "TikTok. I have already opened it twice during this quiz.", weights: { brainRotSeverity: 30, npcEnergy: 20 }, archetypeTags: ["doomscroller"] },
      { id: "d", label: "Discord. I have 14 unread servers and 0 unread feelings.", weights: { goblinModeRisk: 20, brainRotSeverity: 15 }, archetypeTags: ["discord-warlock"] },
    ],
  },
  {
    id: "q_shower_thoughts",
    prompt: "Where do your best ideas usually arrive?",
    choices: [
      { id: "a", label: "While journaling or meditating", weights: { emotionalWifiStrength: 25 } },
      { id: "b", label: "On a long walk", weights: { emotionalWifiStrength: 15 } },
      { id: "c", label: "Shower. 1am. Steam. Genius.", weights: { delusionIndex: 20, sleepDebt: 10, mainCharacterSyndrome: 10 }, archetypeTags: ["microwave-philosopher"] },
      { id: "d", label: "Staring at the microwave for 90 uninterrupted seconds", weights: { delusionIndex: 30, brainRotSeverity: 15 }, archetypeTags: ["microwave-philosopher"] },
    ],
  },
  {
    id: "q_dm_response",
    prompt: "Average DM response time?",
    choices: [
      { id: "a", label: "Within an hour. I am a respectful digital citizen.", weights: { emotionalWifiStrength: 20 } },
      { id: "b", label: "Within a day", weights: { emotionalWifiStrength: 10 } },
      { id: "c", label: "3 to 7 business days, mood permitting", weights: { goblinModeRisk: 20, npcEnergy: 5 }, archetypeTags: ["emotionally-buffering"] },
      { id: "d", label: "I read it. I felt it. I will not be responding.", weights: { goblinModeRisk: 30, brainRotSeverity: 10 }, archetypeTags: ["emotionally-buffering", "online-goblin"] },
    ],
  },
  {
    id: "q_argue_strangers",
    prompt: "Have you ever argued with a stranger on the internet?",
    choices: [
      { id: "a", label: "No, I have inner peace", weights: { emotionalWifiStrength: 25 } },
      { id: "b", label: "Once, briefly, and I'm still ashamed", weights: { emotionalWifiStrength: 5, delusionIndex: 5 } },
      { id: "c", label: "Yes. I've gotten kind of good at it.", weights: { delusionIndex: 20, brainRotSeverity: 20 }, archetypeTags: ["twitter-scholar"] },
      { id: "d", label: "I have screenshots saved as ammunition for future arguments", weights: { delusionIndex: 30, brainRotSeverity: 30, mainCharacterSyndrome: 15 }, archetypeTags: ["twitter-scholar"] },
    ],
  },
  {
    id: "q_voice_memos",
    prompt: "Voice memos: how do we feel?",
    choices: [
      { id: "a", label: "Hate sending, fine receiving", weights: { npcEnergy: 10, emotionalWifiStrength: 5 } },
      { id: "b", label: "Love them, normal length, normal energy", weights: { emotionalWifiStrength: 10 } },
      { id: "c", label: "I have sent a 12-minute voice memo this week", weights: { mainCharacterSyndrome: 20 }, archetypeTags: ["certified-yapper"] },
      { id: "d", label: "I exclusively communicate via 27-minute voice essays", weights: { mainCharacterSyndrome: 30, delusionIndex: 15 }, archetypeTags: ["certified-yapper"] },
    ],
  },
  {
    id: "q_alone",
    prompt: "How long can you sit alone with your thoughts before reaching for a screen?",
    choices: [
      { id: "a", label: "Hours. Peacefully. Like a monk.", weights: { emotionalWifiStrength: 25 } },
      { id: "b", label: "About 30 minutes if I really try", weights: { brainRotSeverity: 10 } },
      { id: "c", label: "Seven seconds. I'm typing this with one hand.", weights: { brainRotSeverity: 30, npcEnergy: 15 }, archetypeTags: ["doomscroller"] },
      { id: "d", label: "I haven't had an un-notified thought since 2021", weights: { brainRotSeverity: 40, npcEnergy: 25 }, archetypeTags: ["doomscroller", "online-goblin"] },
    ],
  },
  {
    id: "q_decision",
    prompt: "Big life decisions: how do you make them?",
    choices: [
      { id: "a", label: "Pros/cons list, careful research, deep breaths", weights: { emotionalWifiStrength: 20 } },
      { id: "b", label: "Ask two or three trusted people", weights: { emotionalWifiStrength: 10 } },
      { id: "c", label: "Vibes, a coin flip, and one (1) very confident TikTok", weights: { delusionIndex: 20, mainCharacterSyndrome: 10 } },
      { id: "d", label: "I poll my group chat at 2am while crying", weights: { delusionIndex: 30, mainCharacterSyndrome: 20, sleepDebt: 15 }, archetypeTags: ["crashout-survivor", "emotionally-buffering"] },
    ],
  },
  {
    id: "q_screen_time",
    prompt: "Honest weekly screen time?",
    choices: [
      { id: "a", label: "Under 3 hours per day, I'm rebuilding civilization", weights: { emotionalWifiStrength: 30 } },
      { id: "b", label: "4 to 6 hours per day, modest cooking", weights: { brainRotSeverity: 10 } },
      { id: "c", label: "8 to 12 hours per day, I have hand cramps", weights: { brainRotSeverity: 25, touchGrassRequirement: 20 }, archetypeTags: ["doomscroller"] },
      { id: "d", label: "The number was so high I disabled the metric", weights: { brainRotSeverity: 40, touchGrassRequirement: 35, goblinModeRisk: 15 }, archetypeTags: ["doomscroller", "online-goblin"] },
    ],
  },
  {
    id: "q_running_bit",
    prompt: "Do you have a long-running bit with your friends?",
    choices: [
      { id: "a", label: "No, we are functional adults", weights: { npcEnergy: 20 } },
      { id: "b", label: "A few inside jokes, healthy levels", weights: { emotionalWifiStrength: 15 } },
      { id: "c", label: "Several. We have lore.", weights: { mainCharacterSyndrome: 15, emotionalWifiStrength: 10 } },
      { id: "d", label: "We have a 4-year-running bit nobody else could comprehend if they tried", weights: { mainCharacterSyndrome: 25, delusionIndex: 10 }, archetypeTags: ["chaotic-coder", "microwave-philosopher"] },
    ],
  },
  {
    id: "q_self_diagnose",
    prompt: "Do you self-diagnose based on 30-second videos?",
    choices: [
      { id: "a", label: "Absolutely not", weights: { emotionalWifiStrength: 20 } },
      { id: "b", label: "Once or twice, with mild shame", weights: { brainRotSeverity: 10 } },
      { id: "c", label: "Yes, I have several new conditions now", weights: { brainRotSeverity: 25, delusionIndex: 25 }, archetypeTags: ["twitter-scholar"] },
      { id: "d", label: "I diagnosed myself again while reading this question", weights: { brainRotSeverity: 35, delusionIndex: 35, mainCharacterSyndrome: 15 }, archetypeTags: ["twitter-scholar", "microwave-philosopher"] },
    ],
  },
  {
    id: "q_party",
    prompt: "At a party, you are most likely:",
    choices: [
      { id: "a", label: "Mingling, having a great time, a true social animal", weights: { emotionalWifiStrength: 25, mainCharacterSyndrome: 5 } },
      { id: "b", label: "Trapped in one conversation for 3 hours, on purpose", weights: { emotionalWifiStrength: 10 }, archetypeTags: ["emotionally-buffering"] },
      { id: "c", label: "Petting the dog the entire night, plotting departure", weights: { goblinModeRisk: 20, emotionalWifiStrength: 5 } },
      { id: "d", label: "Not at the party. I am home. The party is theoretical.", weights: { goblinModeRisk: 35, touchGrassRequirement: 25, npcEnergy: 10 }, archetypeTags: ["online-goblin"] },
    ],
  },
  {
    id: "q_existential",
    prompt: "How often do you have a small existential crisis?",
    choices: [
      { id: "a", label: "Rarely. I am at peace.", weights: { emotionalWifiStrength: 25 } },
      { id: "b", label: "Once or twice a year, very manageable", weights: { emotionalWifiStrength: 10 } },
      { id: "c", label: "Weekly. Wednesdays usually.", weights: { delusionIndex: 20, sleepDebt: 15 }, archetypeTags: ["microwave-philosopher"] },
      { id: "d", label: "I'm in one right now. I have been since 2019.", weights: { delusionIndex: 35, sleepDebt: 25, brainRotSeverity: 15 }, archetypeTags: ["microwave-philosopher", "crashout-survivor"] },
    ],
  },
  {
    id: "q_inner_voice",
    prompt: "Pick the most accurate inner voice:",
    choices: [
      { id: "a", label: "Calm, encouraging, like a great friend", weights: { emotionalWifiStrength: 25 } },
      { id: "b", label: "Mildly anxious narrator", weights: { sleepDebt: 10 } },
      { id: "c", label: "British nature documentarian observing my failures", weights: { mainCharacterSyndrome: 25, delusionIndex: 10 }, archetypeTags: ["microwave-philosopher"] },
      { id: "d", label: "Three voices fighting over the radio. None of them are nice.", weights: { delusionIndex: 30, brainRotSeverity: 20, sleepDebt: 15 }, archetypeTags: ["crashout-survivor", "microwave-philosopher"] },
    ],
  },
  {
    id: "q_red_flag",
    prompt: "Your biggest red flag is honestly:",
    choices: [
      { id: "a", label: "I don't really have one (this is the red flag)", weights: { mainCharacterSyndrome: 20, delusionIndex: 15 } },
      { id: "b", label: "I overthink absolutely everything", weights: { sleepDebt: 15, emotionalWifiStrength: 5 } },
      { id: "c", label: "I will absolutely ghost you for emotional preservation", weights: { goblinModeRisk: 25 }, archetypeTags: ["emotionally-buffering"] },
      { id: "d", label: "I have lore. You don't know the lore. The lore is bad.", weights: { mainCharacterSyndrome: 30, delusionIndex: 20 }, archetypeTags: ["crashout-survivor"] },
    ],
  },
  {
    id: "q_morning",
    prompt: "Your morning routine is:",
    choices: [
      { id: "a", label: "5am, water, sunlight, journal. I am winning.", weights: { emotionalWifiStrength: 30 } },
      { id: "b", label: "Coffee, then function", weights: { emotionalWifiStrength: 10 } },
      { id: "c", label: "Lie in bed scrolling for 90 minutes", weights: { brainRotSeverity: 25, sleepDebt: 10 }, archetypeTags: ["doomscroller"] },
      { id: "d", label: "There is no morning. Time is a flat circle.", weights: { sleepDebt: 30, brainRotSeverity: 20 }, archetypeTags: ["sleep-oracle", "online-goblin"] },
    ],
  },
  {
    id: "q_text_style",
    prompt: "When typing, you use:",
    choices: [
      { id: "a", label: "Full punctuation. Capital letters. Sentences.", weights: { emotionalWifiStrength: 15, npcEnergy: 10 } },
      { id: "b", label: "Casual lowercase, mild punctuation", weights: { emotionalWifiStrength: 5 } },
      { id: "c", label: "lowercase + chaotic commas,, + tone implied", weights: { brainRotSeverity: 15 }, archetypeTags: ["twitter-scholar"] },
      { id: "d", label: "Pure vibes. Tone is conveyed by length and emoji density.", weights: { brainRotSeverity: 30, delusionIndex: 10 }, archetypeTags: ["twitter-scholar", "certified-yapper"] },
    ],
  },
  {
    id: "q_cry_internet",
    prompt: "Last time you cried at something on the internet?",
    choices: [
      { id: "a", label: "I don't cry at internet things, I'm a stone wall", weights: { emotionalWifiStrength: 20, npcEnergy: 10 } },
      { id: "b", label: "Years ago. Not since the Vine compilation.", weights: { emotionalWifiStrength: 10 } },
      { id: "c", label: "This week. A dog reunion video destroyed me.", weights: { emotionalWifiStrength: 5, brainRotSeverity: 10 } },
      { id: "d", label: "Today. A stranger's wedding speech. I do not know them.", weights: { brainRotSeverity: 25, delusionIndex: 20 }, archetypeTags: ["doomscroller", "twitter-scholar"] },
    ],
  },
  {
    id: "q_overthink_text",
    prompt: "How long do you stare at a sent text wondering if it was weird?",
    choices: [
      { id: "a", label: "I don't. I send it and move on.", weights: { emotionalWifiStrength: 25 } },
      { id: "b", label: "A few minutes if it actually mattered", weights: { emotionalWifiStrength: 10 } },
      { id: "c", label: "Several hours, autopsying every word", weights: { sleepDebt: 15, delusionIndex: 20 }, archetypeTags: ["emotionally-buffering"] },
      { id: "d", label: "I delete and rewrite a 4-word message 11 times before sending", weights: { delusionIndex: 30, sleepDebt: 15, brainRotSeverity: 15 }, archetypeTags: ["emotionally-buffering", "crashout-survivor"] },
    ],
  },
  {
    id: "q_hobby",
    prompt: "Your current honest hobby is:",
    choices: [
      { id: "a", label: "An actual physical hobby that exists in 3D space", weights: { emotionalWifiStrength: 25 } },
      { id: "b", label: "Reading or learning an actual skill", weights: { emotionalWifiStrength: 15 } },
      { id: "c", label: "Yapping in 3 group chats simultaneously", weights: { mainCharacterSyndrome: 10, brainRotSeverity: 10 }, archetypeTags: ["certified-yapper", "discord-warlock"] },
      { id: "d", label: "Replying to strangers I will never meet about topics I just learned", weights: { brainRotSeverity: 25, npcEnergy: 5 }, archetypeTags: ["twitter-scholar", "discord-warlock"] },
    ],
  },
  {
    id: "q_recommend",
    prompt: "Someone asks for a movie/show recommendation. You:",
    choices: [
      { id: "a", label: "Recommend one good thing quickly and move on", weights: { emotionalWifiStrength: 20 } },
      { id: "b", label: "Suggest three based on their actual taste", weights: { emotionalWifiStrength: 15, mainCharacterSyndrome: 5 } },
      { id: "c", label: "Send a 9-paragraph essay with Letterboxd links", weights: { mainCharacterSyndrome: 25, delusionIndex: 10 }, archetypeTags: ["certified-yapper"] },
      { id: "d", label: "Build a custom spreadsheet ranked by mood, runtime, and emotional damage", weights: { mainCharacterSyndrome: 35, delusionIndex: 20 }, archetypeTags: ["certified-yapper", "chaotic-coder"] },
    ],
  },
  {
    id: "q_right_now",
    prompt: "Right now, in this exact moment, are you cooked?",
    choices: [
      { id: "a", label: "No, I'm thriving, why are you asking", weights: { emotionalWifiStrength: 30 } },
      { id: "b", label: "A little, but I think it's fine", weights: { brainRotSeverity: 10, sleepDebt: 5 } },
      { id: "c", label: "Yeah probably, yeah", weights: { brainRotSeverity: 25, sleepDebt: 15, goblinModeRisk: 10 }, archetypeTags: ["doomscroller"] },
      { id: "d", label: "So cooked the kitchen has been formally condemned", weights: { brainRotSeverity: 40, sleepDebt: 25, goblinModeRisk: 25, delusionIndex: 20 }, archetypeTags: ["crashout-survivor", "online-goblin"] },
    ],
  },
];

export const QUESTIONS_BY_ID: Map<string, Question> = new Map(QUESTIONS.map((q) => [q.id, q]));
