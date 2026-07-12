import type { JournalEntry } from "./types";

function daysAgo(n: number, hour = 9) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, Math.floor(Math.random() * 59), 0, 0);
  return d.toISOString();
}

let idc = 0;
const uid = () => `demo-${Date.now()}-${idc++}`;

export const DEMO_ENTRIES: JournalEntry[] = [
  {
    id: uid(),
    title: "Morning light on the balcony",
    content:
      "The city was quiet. I made a slow pour-over, watched the steam curl into the cold air, and thought about how much I've changed this year. Small rituals — they carry the weight of everything.",
    category: "Daily Reflection",
    tags: ["morning", "gratitude", "coffee"],
    mood: "calm",
    favorite: true,
    pinned: true,
    createdAt: daysAgo(0, 7),
    updatedAt: daysAgo(0, 7),
  },
  {
    id: uid(),
    title: "Sprint retro — what worked",
    content:
      "Shipping the new onboarding flow felt effortless because we broke it into shameless small PRs. Note to self: never underestimate the compounding value of tiny, boring merges.",
    category: "Work",
    tags: ["retro", "engineering"],
    mood: "happy",
    favorite: false,
    pinned: false,
    createdAt: daysAgo(1, 18),
    updatedAt: daysAgo(1, 18),
  },
  {
    id: uid(),
    title: "Kyoto, day three",
    content:
      "Fushimi Inari before sunrise. The torii gates were empty and orange and endless. I walked until my legs stopped keeping score. Bought matcha from a woman who said her grandmother planted the tea field.",
    category: "Travel",
    tags: ["japan", "kyoto"],
    mood: "loved",
    favorite: true,
    pinned: false,
    createdAt: daysAgo(2, 20),
    updatedAt: daysAgo(2, 20),
  },
  {
    id: uid(),
    title: "Reading notes: Deep Work",
    content:
      "Cal Newport's argument lands harder in year two of remote work. The cost isn't the distraction itself — it's the residue. Attention doesn't teleport; it drags a tail.",
    category: "Study",
    tags: ["books", "focus"],
    mood: "neutral",
    favorite: false,
    pinned: false,
    createdAt: daysAgo(3, 11),
    updatedAt: daysAgo(3, 11),
  },
  {
    id: uid(),
    title: "Idea: pocket-sized journal app",
    content:
      "What if the entire journaling flow lived in one keystroke? Open, write, close. No taxonomy first. Tag later, if ever. The friction is the enemy.",
    category: "Ideas",
    tags: ["product", "design"],
    mood: "excited",
    favorite: true,
    pinned: false,
    createdAt: daysAgo(4, 22),
    updatedAt: daysAgo(4, 22),
  },
  {
    id: uid(),
    title: "A hard conversation, well had",
    content:
      "Told M. how I felt without softening it into a joke first. It was uncomfortable for eleven seconds and better forever after. Directness is a kindness in disguise.",
    category: "Personal",
    tags: ["relationships", "growth"],
    mood: "happy",
    favorite: false,
    pinned: false,
    createdAt: daysAgo(5, 21),
    updatedAt: daysAgo(5, 21),
  },
  {
    id: uid(),
    title: "Rainy Tuesday, low battery",
    content:
      "Nothing dramatic. Just tired. Made soup, closed the laptop early, let the phone die on the counter on purpose.",
    category: "Daily Reflection",
    tags: ["rest"],
    mood: "sad",
    favorite: false,
    pinned: false,
    createdAt: daysAgo(6, 19),
    updatedAt: daysAgo(6, 19),
  },
  {
    id: uid(),
    title: "Design crit — kill the carousel",
    content:
      "Every carousel we've ever shipped underperformed the first slide alone. Today we finally deleted one. The homepage feels ten pounds lighter.",
    category: "Work",
    tags: ["design", "web"],
    mood: "happy",
    favorite: false,
    pinned: false,
    createdAt: daysAgo(8, 15),
    updatedAt: daysAgo(8, 15),
  },
  {
    id: uid(),
    title: "Long walk, no phone",
    content:
      "Two hours along the river. By minute forty my brain finally stopped writing emails and started writing this instead.",
    category: "Personal",
    tags: ["walking", "reset"],
    mood: "calm",
    favorite: false,
    pinned: false,
    createdAt: daysAgo(10, 17),
    updatedAt: daysAgo(10, 17),
  },
  {
    id: uid(),
    title: "First frost",
    content:
      "The rosemary made it. The basil didn't. Autumn always feels like an audit.",
    category: "Daily Reflection",
    tags: ["seasons", "garden"],
    mood: "neutral",
    favorite: false,
    pinned: false,
    createdAt: daysAgo(14, 8),
    updatedAt: daysAgo(14, 8),
  },
];
