export type Mood = "happy" | "neutral" | "sad" | "angry" | "loved" | "excited" | "calm";

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  mood: Mood;
  favorite: boolean;
  pinned: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface JournalSettings {
  theme: "light" | "dark";
  accentHue: number; // 0-360
  fontSize: "sm" | "md" | "lg";
  categories: string[];
}

export const MOODS: { value: Mood; emoji: string; label: string }[] = [
  { value: "happy", emoji: "😊", label: "Happy" },
  { value: "loved", emoji: "😍", label: "Loved" },
  { value: "excited", emoji: "🤩", label: "Excited" },
  { value: "calm", emoji: "😌", label: "Calm" },
  { value: "neutral", emoji: "😐", label: "Neutral" },
  { value: "sad", emoji: "😔", label: "Sad" },
  { value: "angry", emoji: "😡", label: "Angry" },
];

export const DEFAULT_CATEGORIES = [
  "Personal",
  "Work",
  "Study",
  "Travel",
  "Ideas",
  "Daily Reflection",
];
