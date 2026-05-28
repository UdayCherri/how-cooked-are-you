import type { Archetype } from "../types/domain";

export const ARCHETYPES: Archetype[] = [
  {
    tag: "microwave-philosopher",
    title: "Microwave Philosopher",
    tagline: "your deepest thoughts arrive at 1:42am while reheating leftovers",
    flavor: "You have invented at least three personal theories of consciousness while standing in front of a microwave. None of them are wrong. None of them are useful.",
    bestMatchTag: "sleep-oracle",
    worstMatchTag: "doomscroller",
  },
  {
    tag: "discord-warlock",
    title: "Discord Warlock",
    tagline: "you have logged 14,000 hours in voice chat and zero in sunlight",
    flavor: "Your circadian rhythm is set by ping sounds. You can tell who's typing by the cadence of the dots. This is a power and a curse.",
    bestMatchTag: "chaotic-coder",
    worstMatchTag: "online-goblin",
  },
  {
    tag: "certified-yapper",
    title: "Certified Yapper",
    tagline: "you sent a 9-minute voice memo today and felt fine about it",
    flavor: "You have never had a thought you didn't immediately broadcast in detail. Your group chats fear and love you. Your texts are essays. Your essays are texts.",
    bestMatchTag: "chaotic-coder",
    worstMatchTag: "emotionally-buffering",
  },
  {
    tag: "sleep-oracle",
    title: "Sleep-Deprived Oracle",
    tagline: "you haven't slept properly since the second Obama term and you can see the future now",
    flavor: "Your prophecies are correct. Your eye bags are biblical. Doctors hate you. Friends consult you. Sleep has become optional infrastructure.",
    bestMatchTag: "microwave-philosopher",
    worstMatchTag: "doomscroller",
  },
  {
    tag: "online-goblin",
    title: "Chronically Online Goblin",
    tagline: "the sun has filed a missing person report on you",
    flavor: "You speak fluent meme. You have not seen weather in weeks. Your room has a thriving ecosystem of mugs. You are technically thriving.",
    bestMatchTag: "discord-warlock",
    worstMatchTag: "emotionally-buffering",
  },
  {
    tag: "chaotic-coder",
    title: "Chaotic Neutral Coder",
    tagline: "you have 7 unfinished side projects and 1 functional sleep cycle",
    flavor: "You don't finish projects. You collect them. Each one is a love letter to a version of yourself that was briefly very confident at 2am.",
    bestMatchTag: "certified-yapper",
    worstMatchTag: "online-goblin",
  },
  {
    tag: "emotionally-buffering",
    title: "Emotionally Buffering",
    tagline: "your feelings are loading at 2% and the wifi is your therapist's voice",
    flavor: "You will respond to that text. Eventually. After a small spiritual journey. Your inbox is a graveyard of half-typed paragraphs.",
    bestMatchTag: "microwave-philosopher",
    worstMatchTag: "certified-yapper",
  },
  {
    tag: "twitter-scholar",
    title: "Feral Twitter Scholar",
    tagline: "you have cited a tweet in a real argument and you stand by it",
    flavor: "You have opinions. They are well-formed, deeply researched, and shared in batches of 240 characters. You know the lore of three different fandoms you are not in.",
    bestMatchTag: "chaotic-coder",
    worstMatchTag: "sleep-oracle",
  },
  {
    tag: "doomscroller",
    title: "Lo-fi Doomscroller",
    tagline: "you have learned the entire global news cycle horizontally, in bed",
    flavor: "Your thumb has muscle memory you cannot describe. You know everything happening everywhere and have done nothing about any of it. It's fine.",
    bestMatchTag: "online-goblin",
    worstMatchTag: "sleep-oracle",
  },
  {
    tag: "crashout-survivor",
    title: "Ambient Crashout Survivor",
    tagline: "you've had three crashouts this month and each one improved your life slightly",
    flavor: "You're not okay, but you're operational. The crashouts are now part of your release cycle. Friends know to check in around the full moon.",
    bestMatchTag: "emotionally-buffering",
    worstMatchTag: "twitter-scholar",
  },
];

export const ARCHETYPES_BY_TAG: Map<string, Archetype> = new Map(ARCHETYPES.map((a) => [a.tag, a]));

export const FALLBACK_ARCHETYPE: Archetype = {
  tag: "quietly-cooked",
  title: "Quietly Cooked Civilian",
  tagline: "you are cooked in a small, dignified, mostly invisible way",
  flavor: "You pass for normal. You are not normal. You contain multitudes and several unresolved tabs.",
  bestMatchTag: "emotionally-buffering",
  worstMatchTag: "twitter-scholar",
};

export function resolveArchetype(tag: string | null): Archetype {
  if (!tag) return FALLBACK_ARCHETYPE;
  return ARCHETYPES_BY_TAG.get(tag) ?? FALLBACK_ARCHETYPE;
}
