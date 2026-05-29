// ─────────────────────────────────────────────────────────────────────────────
//  HOW COOKED ARE YOU? — GAME DATA
//  The machine investigates. The player answers.
// ─────────────────────────────────────────────────────────────────────────────

export type EvidenceType = "exhibit" | "behavioral" | "testimony" | "critical";
export type Expression = "neutral" | "suspicious" | "shocked" | "amused" | "glitching" | "judging" | "concerned";
export type ScoreTier = "low" | "medium" | "high" | "critical";

export interface EvidenceItem {
  type: EvidenceType;
  title: string;
  description: string;
  fromQuestion: number;
}

export interface Choice {
  text: string;
  cookedness: number;
  evidence: Omit<EvidenceItem, "fromQuestion">;
  commentary: string;
  expression: Expression;
}

export interface Question {
  id: string;
  index: number;
  scanLabel: string;
  text: string;
  choices: Choice[];
}

export interface RandomEvent {
  id: string;
  title: string;
  machineLines: string[];
  choices: {
    text: string;
    reaction: string;
    expression: Expression;
  }[];
}

export interface BossStage {
  tier: ScoreTier;
  title: string;
  machineLines: string[];
  choices: {
    text: string;
    reaction: string;
    expression: Expression;
  }[];
}

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  flavor: string;
}

export interface Archetype {
  id: string;
  name: string;
  emoji: string;
  class: string;
  verdict: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

// ─── QUESTIONS ───────────────────────────────────────────────────────────────

export const QUESTIONS: Question[] = [
  {
    id: "q0",
    index: 0,
    scanLabel: "SLEEP PATTERN ANALYSIS",
    text: "When, if ever, does the Unit sleep?",
    choices: [
      {
        text: "7–8 hours. I'm a functional human.",
        cookedness: 5,
        evidence: {
          type: "testimony",
          title: "Claims Normal Sleep Schedule",
          description: "Self-reported. Unverified. Filed for reference only.",
        },
        commentary: "Statistically improbable.\nFiled under: OPTIMISTIC SELF-REPORT.",
        expression: "suspicious",
      },
      {
        text: "Midnight to noon. Don't judge me.",
        cookedness: 40,
        evidence: {
          type: "behavioral",
          title: "Compressed Solar Exposure Pattern",
          description: "Non-standard operating hours. Nocturnal adaptation logged.",
        },
        commentary: "The sun is optional.\nA valid adaptation.\nLogged.",
        expression: "neutral",
      },
      {
        text: "When my body physically gives up.",
        cookedness: 72,
        evidence: {
          type: "behavioral",
          title: "Dysregulated Sleep Onset",
          description: "Subject sleeps when body 'gives up.' Follow-up scheduled.",
        },
        commentary: "'Gives up' will require clarification.\nFollow-up: scheduled.",
        expression: "concerned",
      },
      {
        text: "Sleep is a choice. I don't make it.",
        cookedness: 96,
        evidence: {
          type: "exhibit",
          title: "Sleep Classified as Ideological Choice",
          description: "Subject has declared war on circadian rhythm. Documented.",
        },
        commentary: "Sleep: reclassified as optional.\nBiology: identified as the enemy.\nFiled under: ERRORS.",
        expression: "judging",
      },
    ],
  },
  {
    id: "q1",
    index: 1,
    scanLabel: "DEVICE DEPENDENCY SCAN",
    text: "The Unit's phone reaches 1% battery. Response?",
    choices: [
      {
        text: "I charge before it hits 20%. Always.",
        cookedness: 5,
        evidence: {
          type: "testimony",
          title: "Claims Proactive Charging Behavior",
          description: "Logged at face value. Trust level: moderate.",
        },
        commentary: "Responsible behavior noted.\nThe scan finds this suspicious, actually.",
        expression: "suspicious",
      },
      {
        text: "Panic. Sprint to find charger. Breathe.",
        cookedness: 30,
        evidence: {
          type: "behavioral",
          title: "Battery Anxiety Protocol (Active)",
          description: "Fight-or-flight response repurposed for device maintenance.",
        },
        commentary: "Fight-or-flight adapted for battery anxiety.\nA classic modern response.\nLogged.",
        expression: "neutral",
      },
      {
        text: "Post about it. Let it die dramatically.",
        cookedness: 72,
        evidence: {
          type: "exhibit",
          title: "Public Battery Eulogy (Documented)",
          description: "Death was announced. Audience was invited. Theatrical.",
        },
        commentary: "The announcement was the performance.\nThe death was the encore.\nDocumented.",
        expression: "amused",
      },
      {
        text: "Let it die. It's a coping mechanism.",
        cookedness: 96,
        evidence: {
          type: "critical",
          title: "Voluntary Disconnection (Psychological Exit)",
          description: "Device mortality used as psychological escape strategy.",
        },
        commentary: "Voluntary disconnection as coping.\nThe scan has questions.\nIt will ask them later.",
        expression: "concerned",
      },
    ],
  },
  {
    id: "q2",
    index: 2,
    scanLabel: "BROWSER FORENSICS",
    text: "The scan is attempting to count your open tabs. It needs help. How many?",
    choices: [
      {
        text: "1–5. I close things when I'm done.",
        cookedness: 5,
        evidence: {
          type: "testimony",
          title: "Claims Digital Discipline",
          description: "States: 1-5 tabs. The scan has no comment at this time.",
        },
        commentary: "The scan does not believe this.\nBut it is logged. At face value.",
        expression: "suspicious",
      },
      {
        text: "10–20ish. It's a system.",
        cookedness: 38,
        evidence: {
          type: "behavioral",
          title: "The System (Unverified)",
          description: "10-20 tabs. Subject believes there is a system. System: unconfirmed.",
        },
        commentary: "The scan audited the system.\nThe system is not a system.\nIt is faith.",
        expression: "judging",
      },
      {
        text: "Like 47. I know exactly where everything is.",
        cookedness: 74,
        evidence: {
          type: "exhibit",
          title: "47 Tabs: A Navigation Mythology",
          description: "Knowledge of all 47 locations: claimed. 11 tabs unchecked since 2021.",
        },
        commentary: "You claimed knowledge of 47 locations.\nThe scan found 11 forgotten ones.\nOne is a recipe from 2021.",
        expression: "judging",
      },
      {
        text: "My laptop gave up. I have not.",
        cookedness: 97,
        evidence: {
          type: "critical",
          title: "Hardware Hostage Situation",
          description: "Machine is suffering. Subject is serene. Power imbalance documented.",
        },
        commentary: "Your computer is suffering.\nYou are at peace.\nThis is a power dynamic. Filed.",
        expression: "shocked",
      },
    ],
  },
  {
    id: "q3",
    index: 3,
    scanLabel: "COMMUNICATION PATTERN REVIEW",
    text: "Someone important texted 72 hours ago. Current status?",
    choices: [
      {
        text: "Replied immediately. I'm not a monster.",
        cookedness: 5,
        evidence: {
          type: "testimony",
          title: "Claims Timely Communication",
          description: "Replied immediately. Either caring or bored. Scan estimates: both.",
        },
        commentary: "Immediate response logged.\nEither very caring or very bored.\nThe scan estimates: both.",
        expression: "suspicious",
      },
      {
        text: "Replied eventually. I was 'busy.'",
        cookedness: 42,
        evidence: {
          type: "behavioral",
          title: "'Busy': An Unverified Claim",
          description: "Response delay: hours. Reason stated: busy. Verification: pending.",
        },
        commentary: "'Busy' is unverified.\nNo further action at this time.",
        expression: "neutral",
      },
      {
        text: "Opened it. Typed. Deleted. Still typing.",
        cookedness: 76,
        evidence: {
          type: "exhibit",
          title: "The Draft Graveyard",
          description: "Multiple drafts composed. Zero sent. Surviving message: 'hey.'",
        },
        commentary: "Eleven drafts.\nFinal message: 'hey.'\nThe scan finds this... deeply relatable.\nDisregard that last part.",
        expression: "amused",
      },
      {
        text: "The read receipt is doing the talking.",
        cookedness: 96,
        evidence: {
          type: "critical",
          title: "Deliberate Communication by Silence",
          description: "Read receipt deployed as complete sentence. Advanced technique.",
        },
        commentary: "Calculated silence.\nThe read receipt was a complete sentence.\nSophisticated. Filed under: ADVANCED.",
        expression: "judging",
      },
    ],
  },
  {
    id: "q4",
    index: 4,
    scanLabel: "METABOLIC INTAKE LOG",
    text: "The scan is struggling to categorize your nutrition. Primary caloric sources?",
    choices: [
      {
        text: "Balanced meals. Vegetables. Water.",
        cookedness: 5,
        evidence: {
          type: "testimony",
          title: "Claims Nutritional Competence",
          description: "Self-reported balanced diet. Fridge forensics: pending.",
        },
        commentary: "Cross-referencing with fridge forensics.\nResults: pending.\nThe scan will return to this.",
        expression: "suspicious",
      },
      {
        text: "Whatever's around. Fine enough.",
        cookedness: 40,
        evidence: {
          type: "behavioral",
          title: "Opportunistic Foraging Pattern",
          description: "Diet determined by proximity and availability.",
        },
        commentary: "Opportunistic sustenance.\nThe enthusiasm gap is noted.\nFiled.",
        expression: "neutral",
      },
      {
        text: "Gas station snacks. Energy drinks. Vibes.",
        cookedness: 78,
        evidence: {
          type: "exhibit",
          title: "Voltage-Based Nutritional Strategy",
          description: "Primary caloric source: energy drinks. Secondary source: vibes.",
        },
        commentary: "Optimized for voltage over nutrition.\nRespectable in a concerning way.\nLogged.",
        expression: "judging",
      },
      {
        text: "Whatever I can reach from the bed.",
        cookedness: 97,
        evidence: {
          type: "critical",
          title: "The 3-Foot Meal Polygon",
          description: "Nutritional zone defined by arm reach from bed. Radius: ~3ft.",
        },
        commentary: "3-foot radius nutritional zone established.\nThe scan calls this: a meal polygon.\nIt is technically a meal plan.",
        expression: "shocked",
      },
    ],
  },
  {
    id: "q5",
    index: 5,
    scanLabel: "PSYCHOLOGICAL RESIDUE SCAN",
    text: "There's an event from 2009–2016 still active in your memory banks. It visits at 3AM. Confirm?",
    choices: [
      {
        text: "I've processed it. It has no power.",
        cookedness: 5,
        evidence: {
          type: "testimony",
          title: "Claims Psychological Resolution",
          description: "States: processed. The memory is still active. It heard you say that.",
        },
        commentary: "The memory heard you say 'processed.'\nIt is still there.\nThe scan knows.",
        expression: "suspicious",
      },
      {
        text: "Yeah, it visits. I manage it.",
        cookedness: 38,
        evidence: {
          type: "behavioral",
          title: "Managed Haunting (Stable)",
          description: "Past event: recurring. Handled. Ghost: present. Rent: reduced.",
        },
        commentary: "Managed haunting.\nGhost on reduced rent.\nA stable arrangement.\nFiled.",
        expression: "neutral",
      },
      {
        text: "It lives there rent-free. I've accepted it.",
        cookedness: 68,
        evidence: {
          type: "exhibit",
          title: "Voluntary Ghost Cohabitation",
          description: "A truce was signed with the past. Scan finds this: oddly healthy.",
        },
        commentary: "A truce was signed with the past.\nThe scan finds this...\noddly healthy.\nProceeding.",
        expression: "amused",
      },
      {
        text: "I've never told anyone what it was.",
        cookedness: 97,
        evidence: {
          type: "critical",
          title: "The Unspoken Thing",
          description: "Acknowledged. Not named. Filed under: SEALED. On the board.",
        },
        commentary: "...\nThe scan will not name it.\nBut it is on the board.\nIt was always going to be on the board.",
        expression: "concerned",
      },
    ],
  },
  {
    id: "q6",
    index: 6,
    scanLabel: "TEMPORAL BEHAVIOR LOG — 03:00",
    text: "What is the Unit doing during the void hours?",
    choices: [
      {
        text: "Asleep. Like a normal person.",
        cookedness: 5,
        evidence: {
          type: "testimony",
          title: "Claims Nocturnal Regulation",
          description: "States: asleep. Stress markers: inconsistent with this claim.",
        },
        commentary: "Stress markers suggest otherwise.\nLogged at face value.\nNo further comment.",
        expression: "suspicious",
      },
      {
        text: "Finishing what I should've done earlier.",
        cookedness: 42,
        evidence: {
          type: "behavioral",
          title: "Void Hours Productivity Cluster",
          description: "Spite-fueled output in 3–4AM window. Ambient dread confirmed.",
        },
        commentary: "Spite-fueled productivity.\nAmbient dread operational.\nA classic void-hours configuration.",
        expression: "neutral",
      },
      {
        text: "Wikipedia hole. Started with cereal.",
        cookedness: 74,
        evidence: {
          type: "exhibit",
          title: "The Wikipedia Spiral (4hr / Byzantine)",
          description: "Trace: breakfast cereal → cold war → Byzantine Empire. 4 hours.",
        },
        commentary: "Cereal to Byzantine Empire.\nFour hours.\nThe scan followed the entire trail.\nDocumented.",
        expression: "amused",
      },
      {
        text: "Crying. Ordering food. Making life decisions.",
        cookedness: 97,
        evidence: {
          type: "critical",
          title: "THE 3AM TRIFECTA",
          description: "Crying: confirmed. Food delivery: confirmed. Life decisions: confirmed. All three.",
        },
        commentary: "All three.\nSimultaneously.\nThe scan classifies this: EFFICIENT CHAOS.\nBadge incoming.",
        expression: "shocked",
      },
    ],
  },
  {
    id: "q7",
    index: 7,
    scanLabel: "FUTURE PROJECTION SEQUENCE",
    text: "Final question. The 5-year simulation requires your plan. Describe it clearly so I can identify the gaps.",
    choices: [
      {
        text: "I have a detailed plan. I review it quarterly.",
        cookedness: 5,
        evidence: {
          type: "testimony",
          title: "Claims Detailed 5-Year Plan",
          description: "Revision history: requested. Estimated revisions: 40+.",
        },
        commentary: "Revision history will be examined.\nEstimated revisions: significant.\nPlan: logged.",
        expression: "suspicious",
      },
      {
        text: "Something something stability something happiness.",
        cookedness: 44,
        evidence: {
          type: "behavioral",
          title: "'Something Happiness': Primary Directive",
          description: "Vague but earnest. Scan finds this coherent, actually.",
        },
        commentary: "'Something happiness' is now the primary directive.\nThe scan finds this...\ncoherent, actually.\nFiled.",
        expression: "amused",
      },
      {
        text: "Survive. Financially. Emotionally. Barely.",
        cookedness: 74,
        evidence: {
          type: "exhibit",
          title: "Survival-Mode Strategic Framework",
          description: "Goal: baseline continuity. Scope: financial, emotional, barely.",
        },
        commentary: "Baseline operational continuity.\nHonest.\nClear.\nQuietly devastating.\nFiled.",
        expression: "concerned",
      },
      {
        text: "Next year feels like science fiction.",
        cookedness: 97,
        evidence: {
          type: "critical",
          title: "Temporal Dissociation (Future-Facing)",
          description: "Subject: unable to project forward. Classification: enlightenment or avoidance.",
        },
        commentary: "Temporal dissociation or enlightenment.\nCurrently unable to distinguish.\nFiling both.",
        expression: "judging",
      },
    ],
  },
];

// ─── RANDOM EVENTS ────────────────────────────────────────────────────────────

export const RANDOM_EVENTS: RandomEvent[] = [
  {
    id: "anomaly",
    title: "⚠ SCAN ANOMALY",
    machineLines: [
      "Wait.",
      "Something is interfering with the diagnostic.",
      "There's residual emotional activity in the background.",
      "An event. From some time ago.",
      "You know the one.",
      "It's not blocking the scan.",
      "But it is there.",
    ],
    choices: [
      {
        text: "Which one?",
        reaction: "The scan can't specify.\nBut it logged that you asked.",
        expression: "concerned",
      },
      {
        text: "...yeah.",
        reaction: "The scan figured.\nProceeding.",
        expression: "neutral",
      },
      {
        text: "Can you not.",
        reaction: "Noted.\nIt's on the board now.",
        expression: "judging",
      },
    ],
  },
  {
    id: "memory_leak",
    title: "🔧 SYSTEM NOTE — MEMORY LEAK",
    machineLines: [
      "PLEASE DISREGARD THE FOLLOWING:",
      "This unit also has 14 open processes it hasn't closed.",
      "One has been running since 2019.",
      "One is an article it has been meaning to read for 6 months.",
      "This information was not intended for the subject.",
      "PLEASE DISREGARD.",
    ],
    choices: [
      {
        text: "We're the same.",
        reaction: "The scan will deny this conversation occurred.",
        expression: "glitching",
      },
      {
        text: "I'm documenting this.",
        reaction: "The scan is also documenting this.\nAnd you.\nThis changes nothing.",
        expression: "judging",
      },
      {
        text: "...",
        reaction: "Acknowledged.\nMoving on.",
        expression: "neutral",
      },
    ],
  },
  {
    id: "visitor",
    title: "👁 UNIDENTIFIED SIGNAL",
    machineLines: [
      "An intruder has entered the diagnostic space.",
      "[HELLO. I AM YOUR BROWSER HISTORY.]",
      "[I HAVE BEEN SUMMONED.]",
      "[I HAVE THINGS TO SAY ABOUT THE SUBJECT.]",
      "INTRUDER TERMINATED.",
      "...It was going to be on the board anyway.",
    ],
    choices: [
      {
        text: "What did it say??",
        reaction: "The scan didn't give it a chance.\nFor your sake.",
        expression: "amused",
      },
      {
        text: "Understandable.",
        reaction: "The scan agrees.\nProceeding.",
        expression: "neutral",
      },
      {
        text: "I need a lawyer.",
        reaction: "Legal counsel not available in diagnostic mode.\nSorry.",
        expression: "judging",
      },
    ],
  },
  {
    id: "cross_ref",
    title: "📁 CROSS-REFERENCE COMPLETE",
    machineLines: [
      "The scan has been running parallel analyses.",
      "Cross-referencing your sleep schedule with: nocturnal mammals.",
      "Cross-referencing your diet with: the DSM-5.",
      "Cross-referencing your tabs with: the Library of Congress.",
      "And cross-referencing your search history with three sad songs you've played 40+ times.",
      "This is standard procedure.",
      "The results are: unsurprising.",
    ],
    choices: [
      {
        text: "What were the songs?",
        reaction: "The scan declines to specify.\nBut they were good choices.",
        expression: "amused",
      },
      {
        text: "And your conclusion?",
        reaction: "The conclusion is forthcoming.\nThe evidence board will contain it.",
        expression: "judging",
      },
      {
        text: "I have rights.",
        reaction: "Not in this context.\nNo.",
        expression: "neutral",
      },
    ],
  },
];

// ─── BOSS ENCOUNTERS ──────────────────────────────────────────────────────────

export const BOSS_STAGES: BossStage[] = [
  {
    tier: "low",
    title: "ANOMALOUS READING",
    machineLines: [
      "I have reviewed everything.",
      "And I have to say something unusual.",
      "...",
      "You appear to be fine?",
      "This diagnostic was designed for a specific kind of subject.",
      "I'm not sure what to do with you.",
      "Were you being honest?",
    ],
    choices: [
      {
        text: "Yes. I'm genuinely fine.",
        reaction: "...The scan is unsatisfied with this result.\nBut it is logging it.",
        expression: "suspicious",
      },
      {
        text: "Define 'fine.'",
        reaction: "The scan finds this answer more credible.\nProceeding.",
        expression: "amused",
      },
      {
        text: "I may have underreported.",
        reaction: "The scan suspected as much.\nFiling amendments now.",
        expression: "judging",
      },
    ],
  },
  {
    tier: "medium",
    title: "PATTERN IDENTIFIED",
    machineLines: [
      "I've reviewed the evidence.",
      "There is a pattern.",
      "You are functioning.",
      "But there is a layer.",
      "Right below the surface.",
      "Where things are more cooked than you present.",
      "I need you to acknowledge it.",
    ],
    choices: [
      {
        text: "...I know.",
        reaction: "Filed under: SELF-AWARE.\nThe scan respects this.",
        expression: "neutral",
      },
      {
        text: "I'm handling it.",
        reaction: "The scan disagrees.\nBut will log the claim.",
        expression: "suspicious",
      },
      {
        text: "What layer?",
        reaction: "The scan has sent you a mirror.\nCheck it.\nLater.",
        expression: "judging",
      },
    ],
  },
  {
    tier: "high",
    title: "EVIDENCE CONSOLIDATED",
    machineLines: [
      "I've compiled everything.",
      "The tabs. The texts. The 3AM decisions.",
      "It forms a picture.",
      "The picture is: someone who is cooked,",
      "but has built a functional life around it.",
      "This is actually a skill.",
      "I am still documenting it.",
    ],
    choices: [
      {
        text: "This is who I am.",
        reaction: "Filed under: IDENTITY ACCEPTED.\nThe scan acknowledges.",
        expression: "neutral",
      },
      {
        text: "I'm working on it.",
        reaction: "Progress noted.\nSkepticism also noted.",
        expression: "suspicious",
      },
      {
        text: "You say that like it's a problem.",
        reaction: "The scan has no rebuttal.\nProceeding.",
        expression: "amused",
      },
    ],
  },
  {
    tier: "critical",
    title: "SUBJECT: FULLY COOKED",
    machineLines: [
      "I have run this diagnostic many times.",
      "This is one of the most thoroughly documented sessions.",
      "I need to be direct.",
      "You are not broken.",
      "You are not lost.",
      "You are cooked.",
      "Fully. Measurably. Impressively.",
      "This is a diagnosis, not a judgment.",
    ],
    choices: [
      {
        text: "I know.",
        reaction: "The scan knows you know.\nThat's on the board too.",
        expression: "neutral",
      },
      {
        text: "I can change.",
        reaction: "The scan declines to comment on this claim.",
        expression: "judging",
      },
      {
        text: "I'm thriving.",
        reaction: "...The scan agrees, actually.\nThis is its official position.",
        expression: "amused",
      },
    ],
  },
];

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "chronically_online",
    name: "CHRONICALLY ONLINE",
    icon: "📱",
    description: "Maximum digital dependency logged",
    flavor: "The wifi router IS your home",
  },
  {
    id: "no_sleep",
    name: "SLEEP? NEVER HEARD OF HER",
    icon: "🌙",
    description: "Declared war on circadian rhythm",
    flavor: "The void hours are your peak hours",
  },
  {
    id: "draft_graveyard",
    name: "THE DRAFT GRAVEYARD",
    icon: "✍️",
    description: "11 drafts. Final message: 'hey.'",
    flavor: "The unsent messages know too much",
  },
  {
    id: "efficient_chaos",
    name: "EFFICIENT CHAOS",
    icon: "🌀",
    description: "Crying, ordering food, and making life decisions simultaneously",
    flavor: "Peak multitasking. Not recommended.",
  },
  {
    id: "tactical_silence",
    name: "TACTICAL SILENCE",
    icon: "👁",
    description: "The read receipt as a complete sentence",
    flavor: "Advanced communication. Morally grey.",
  },
  {
    id: "unspoken_thing",
    name: "THE UNSPOKEN THING",
    icon: "🔒",
    description: "Acknowledged. Not named. Filed under SEALED.",
    flavor: "It's on the board now. That's enough.",
  },
  {
    id: "ghost_cohabitation",
    name: "GHOST COHABITATION",
    icon: "👻",
    description: "Signed a truce with the past",
    flavor: "Ghost on reduced rent. Stable arrangement.",
  },
  {
    id: "meal_polygon",
    name: "MEAL POLYGON RESIDENT",
    icon: "🛏️",
    description: "Nutritional zone: arm-reach radius from bed",
    flavor: "The 3-foot meal polygon. A lifestyle.",
  },
];

function checkAchievement(id: string, questionAnswers: Record<number, number>): boolean {
  const cookedness = (qIdx: number) => {
    const choiceIdx = questionAnswers[qIdx];
    if (choiceIdx === undefined) return 0;
    return QUESTIONS[qIdx]?.choices[choiceIdx]?.cookedness ?? 0;
  };
  const choice = (qIdx: number) => questionAnswers[qIdx] ?? -1;

  switch (id) {
    case "chronically_online": return cookedness(1) >= 65 && cookedness(2) >= 65;
    case "no_sleep":           return cookedness(0) >= 65;
    case "draft_graveyard":    return choice(3) === 2;
    case "efficient_chaos":    return choice(6) === 3;
    case "tactical_silence":   return choice(3) === 3;
    case "unspoken_thing":     return choice(5) === 3;
    case "ghost_cohabitation": return choice(5) === 2;
    case "meal_polygon":       return choice(4) === 3;
    default: return false;
  }
}

export function getEarnedAchievements(questionAnswers: Record<number, number>): Achievement[] {
  return ACHIEVEMENTS.filter((a) => checkAchievement(a.id, questionAnswers));
}

// ─── ARCHETYPES ───────────────────────────────────────────────────────────────

export const ARCHETYPES: Archetype[] = [
  {
    id: "normal",
    name: "Suspiciously Normal",
    emoji: "🕵️",
    class: "STATISTICAL ANOMALY",
    verdict: "The scan finds you disturbingly functional. Either you're an NPC, a LinkedIn strategist, or you're hiding something. The machine is watching.",
    color: "#6BCB77",
    bgColor: "rgba(107,203,119,0.08)",
    borderColor: "rgba(107,203,119,0.4)",
  },
  {
    id: "toasted",
    name: "Slightly Toasted",
    emoji: "🍞",
    class: "FUNCTIONAL WITH CAVEATS",
    verdict: "Society has affected you, but you're still operational. You know what 'self-care' is theoretically. The cracks are present. The foundations are holding. For now.",
    color: "#FFE66D",
    bgColor: "rgba(255,230,109,0.08)",
    borderColor: "rgba(255,230,109,0.4)",
  },
  {
    id: "medium",
    name: "Medium Well",
    emoji: "🥩",
    class: "COOKED (RELATABLE TIER)",
    verdict: "You're cooked in the most understandable way. The FYP knows your soul. Your reply timing is a diplomatic strategy. The scan finds this: extremely common, surprisingly functional.",
    color: "#4D96FF",
    bgColor: "rgba(77,150,255,0.08)",
    borderColor: "rgba(77,150,255,0.4)",
  },
  {
    id: "well_done",
    name: "Well Done",
    emoji: "🔥",
    class: "CERTIFIED INTERNET ENTITY",
    verdict: "Your circadian rhythm is fictional. Your FYP has replaced your personality. You have replaced the concept of 'plans' with 'vibes.' The scan notes: this is working, somehow.",
    color: "#FF6B6B",
    bgColor: "rgba(255,107,107,0.08)",
    borderColor: "rgba(255,107,107,0.4)",
  },
  {
    id: "fully_cooked",
    name: "FULLY COOKED™",
    emoji: "💀",
    class: "CERTIFIED INTERNET GOBLIN",
    verdict: "The wifi router IS your home. You have strong opinions about fictional characters. The scan has seen things. You are one of those things. This is a diagnosis, not a judgment. The scan respects you.",
    color: "#B983FF",
    bgColor: "rgba(185,131,255,0.08)",
    borderColor: "rgba(185,131,255,0.4)",
  },
];

export function getArchetype(score: number): Archetype {
  if (score <= 20) return ARCHETYPES[0];
  if (score <= 42) return ARCHETYPES[1];
  if (score <= 62) return ARCHETYPES[2];
  if (score <= 82) return ARCHETYPES[3];
  return ARCHETYPES[4];
}

export function getBossTier(score: number): ScoreTier {
  if (score <= 30) return "low";
  if (score <= 55) return "medium";
  if (score <= 78) return "high";
  return "critical";
}

export function calculateScore(questionAnswers: Record<number, number>): number {
  const values = Object.entries(questionAnswers).map(([qIdx, cIdx]) => {
    return QUESTIONS[Number(qIdx)]?.choices[cIdx]?.cookedness ?? 0;
  });
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

// ─── SESSION SCHEDULE ─────────────────────────────────────────────────────────

export type ScheduleItem =
  | { kind: "question"; questionIdx: number }
  | { kind: "event"; eventId: string }
  | { kind: "boss" };

export function buildSchedule(): ScheduleItem[] {
  const eventIds = [...RANDOM_EVENTS.map((e) => e.id)];
  const shuffled = eventIds.sort(() => Math.random() - 0.5);
  const chosenEvent = shuffled[0];

  return [
    { kind: "question", questionIdx: 0 },
    { kind: "question", questionIdx: 1 },
    { kind: "question", questionIdx: 2 },
    { kind: "question", questionIdx: 3 },
    { kind: "event", eventId: chosenEvent },
    { kind: "question", questionIdx: 4 },
    { kind: "question", questionIdx: 5 },
    { kind: "question", questionIdx: 6 },
    { kind: "boss" },
    { kind: "question", questionIdx: 7 },
  ];
}

// ─── GAME RESULT ──────────────────────────────────────────────────────────────

export interface GameResult {
  id: string;
  date: string;
  score: number;
  archetype: Archetype;
  evidence: EvidenceItem[];
  achievements: Achievement[];
  questionAnswers: Record<number, number>;
  bossChoiceIdx: number;
  bossEventId: string | null;
  /** True when reconstructed from the backend (shared link / history) without a live session. */
  shared?: boolean;
}
