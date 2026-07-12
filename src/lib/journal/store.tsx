import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_CATEGORIES, type JournalEntry, type JournalSettings, type Mood } from "./types";
import { DEMO_ENTRIES } from "./demo-data";

const ENTRIES_KEY = "journal:entries:v1";
const SETTINGS_KEY = "journal:settings:v1";
const SEEDED_KEY = "journal:seeded:v1";

function loadEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function loadSettings(): JournalSettings {
  const defaults: JournalSettings = {
    theme: "light",
    accentHue: 28,
    fontSize: "md",
    categories: DEFAULT_CATEGORIES,
  };
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch {}
  return defaults;
}

interface JournalContextValue {
  entries: JournalEntry[];
  settings: JournalSettings;
  hydrated: boolean;
  createEntry: (data: Partial<JournalEntry>) => JournalEntry;
  updateEntry: (id: string, patch: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  duplicateEntry: (id: string) => void;
  toggleFavorite: (id: string) => void;
  togglePinned: (id: string) => void;
  addCategory: (name: string) => void;
  removeCategory: (name: string) => void;
  updateSettings: (patch: Partial<JournalSettings>) => void;
  clearAll: () => void;
  exportJson: () => string;
  importJson: (raw: string) => { ok: boolean; message: string };
}

const JournalContext = createContext<JournalContextValue | null>(null);

const uid = () =>
  `e_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

export function JournalProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [settings, setSettings] = useState<JournalSettings>(() => ({
    theme: "light",
    accentHue: 28,
    fontSize: "md",
    categories: DEFAULT_CATEGORIES,
  }));
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage — client only
  useEffect(() => {
    const seeded = localStorage.getItem(SEEDED_KEY);
    const stored = loadEntries();
    if (!seeded && stored.length === 0) {
      setEntries(DEMO_ENTRIES);
      localStorage.setItem(ENTRIES_KEY, JSON.stringify(DEMO_ENTRIES));
      localStorage.setItem(SEEDED_KEY, "1");
    } else {
      setEntries(stored);
    }
    setSettings(loadSettings());
    setHydrated(true);
  }, []);

  // Persist
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  }, [entries, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    // Apply theme + accent
    const root = document.documentElement;
    root.classList.toggle("dark", settings.theme === "dark");
    root.style.setProperty("--accent-hue", String(settings.accentHue));
    const sizeMap = { sm: "15px", md: "16px", lg: "18px" };
    root.style.fontSize = sizeMap[settings.fontSize];
  }, [settings, hydrated]);

  const createEntry = useCallback((data: Partial<JournalEntry>) => {
    const now = new Date().toISOString();
    const entry: JournalEntry = {
      id: uid(),
      title: data.title ?? "Untitled entry",
      content: data.content ?? "",
      category: data.category ?? "Personal",
      tags: data.tags ?? [],
      mood: (data.mood ?? "neutral") as Mood,
      favorite: data.favorite ?? false,
      pinned: data.pinned ?? false,
      createdAt: now,
      updatedAt: now,
    };
    setEntries((prev) => [entry, ...prev]);
    return entry;
  }, []);

  const updateEntry = useCallback((id: string, patch: Partial<JournalEntry>) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, ...patch, updatedAt: new Date().toISOString() } : e,
      ),
    );
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const duplicateEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const src = prev.find((e) => e.id === id);
      if (!src) return prev;
      const now = new Date().toISOString();
      return [
        { ...src, id: uid(), title: `${src.title} (copy)`, createdAt: now, updatedAt: now, pinned: false },
        ...prev,
      ];
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, favorite: !e.favorite } : e)));
  }, []);

  const togglePinned = useCallback((id: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, pinned: !e.pinned } : e)));
  }, []);

  const addCategory = useCallback((name: string) => {
    const clean = name.trim();
    if (!clean) return;
    setSettings((s) =>
      s.categories.includes(clean) ? s : { ...s, categories: [...s.categories, clean] },
    );
  }, []);

  const removeCategory = useCallback((name: string) => {
    setSettings((s) => ({ ...s, categories: s.categories.filter((c) => c !== name) }));
  }, []);

  const updateSettings = useCallback((patch: Partial<JournalSettings>) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);

  const clearAll = useCallback(() => {
    setEntries([]);
    localStorage.removeItem(ENTRIES_KEY);
    localStorage.removeItem(SEEDED_KEY);
  }, []);

  const exportJson = useCallback(() => {
    return JSON.stringify({ entries, settings, exportedAt: new Date().toISOString() }, null, 2);
  }, [entries, settings]);

  const importJson = useCallback((raw: string) => {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.entries)) {
        setEntries(parsed.entries);
        if (parsed.settings) setSettings((s) => ({ ...s, ...parsed.settings }));
        return { ok: true, message: `Imported ${parsed.entries.length} entries.` };
      }
      return { ok: false, message: "Invalid file — missing entries array." };
    } catch (e) {
      return { ok: false, message: "Could not parse JSON." };
    }
  }, []);

  const value = useMemo<JournalContextValue>(
    () => ({
      entries,
      settings,
      hydrated,
      createEntry,
      updateEntry,
      deleteEntry,
      duplicateEntry,
      toggleFavorite,
      togglePinned,
      addCategory,
      removeCategory,
      updateSettings,
      clearAll,
      exportJson,
      importJson,
    }),
    [entries, settings, hydrated, createEntry, updateEntry, deleteEntry, duplicateEntry, toggleFavorite, togglePinned, addCategory, removeCategory, updateSettings, clearAll, exportJson, importJson],
  );

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}

export function useJournal() {
  const ctx = useContext(JournalContext);
  if (!ctx) throw new Error("useJournal must be used inside JournalProvider");
  return ctx;
}

// Derived helpers
export function computeStreak(entries: JournalEntry[]): number {
  if (!entries.length) return 0;
  const days = new Set(
    entries.map((e) => new Date(e.createdAt).toISOString().slice(0, 10)),
  );
  let streak = 0;
  const d = new Date();
  // Allow starting from today OR yesterday
  const todayKey = d.toISOString().slice(0, 10);
  if (!days.has(todayKey)) {
    d.setDate(d.getDate() - 1);
  }
  while (days.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
