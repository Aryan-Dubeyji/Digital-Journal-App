import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Download, Upload, Trash2, Plus, X, Moon, Sun } from "lucide-react";
import { AppShell } from "@/components/journal/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useJournal } from "@/lib/journal/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · Marginalia" },
      { name: "description", content: "Personalize your journal — themes, categories, and data." },
    ],
  }),
  component: SettingsPage,
});

const ACCENTS: { name: string; hue: number }[] = [
  { name: "Amber", hue: 60 },
  { name: "Rose", hue: 20 },
  { name: "Sage", hue: 145 },
  { name: "Ocean", hue: 220 },
  { name: "Violet", hue: 285 },
  { name: "Ink", hue: 260 },
];

function SettingsPage() {
  const {
    settings,
    updateSettings,
    addCategory,
    removeCategory,
    exportJson,
    importJson,
    clearAll,
    entries,
  } = useJournal();
  const [newCat, setNewCat] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marginalia-journal-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Journal exported.");
  };

  const handleImport = async (file: File) => {
    const text = await file.text();
    const res = importJson(text);
    if (res.ok) toast.success(res.message);
    else toast.error(res.message);
  };

  const handleClear = () => {
    if (confirm("Delete all entries permanently? This can't be undone.")) {
      clearAll();
      toast.success("All entries cleared.");
    }
  };

  return (
    <AppShell>
      <h1 className="font-display text-4xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Everything lives on this device — nothing leaves without you.
      </p>

      <div className="mt-8 space-y-6">
        <Section title="Appearance" desc="Match the notebook to your desk.">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Theme</Label>
              <div className="mt-2 inline-flex rounded-xl border border-border bg-surface p-1">
                {(["light", "dark"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => updateSettings({ theme: t })}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm capitalize transition",
                      settings.theme === t
                        ? "bg-card shadow-[var(--shadow-soft)]"
                        : "text-muted-foreground",
                    )}
                  >
                    {t === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Font size</Label>
              <div className="mt-2 inline-flex rounded-xl border border-border bg-surface p-1">
                {(["sm", "md", "lg"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateSettings({ fontSize: s })}
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm uppercase transition",
                      settings.fontSize === s
                        ? "bg-card shadow-[var(--shadow-soft)]"
                        : "text-muted-foreground",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Accent color</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {ACCENTS.map((a) => (
                <button
                  key={a.hue}
                  onClick={() => updateSettings({ accentHue: a.hue })}
                  className={cn(
                    "group flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition",
                    settings.accentHue === a.hue
                      ? "border-primary bg-accent"
                      : "border-border hover:bg-secondary",
                  )}
                >
                  <span
                    className="h-4 w-4 rounded-full"
                    style={{ background: `oklch(0.65 0.15 ${a.hue})` }}
                  />
                  {a.name}
                </button>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Categories" desc="Sort your writing however feels natural.">
          <div className="flex flex-wrap gap-2">
            {settings.categories.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm"
              >
                {c}
                <button
                  onClick={() => removeCategory(c)}
                  className="opacity-50 hover:opacity-100"
                  aria-label={`Remove ${c}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Input
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="Add a category…"
              className="max-w-xs rounded-xl"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addCategory(newCat);
                  setNewCat("");
                }
              }}
            />
            <Button
              onClick={() => {
                addCategory(newCat);
                setNewCat("");
              }}
              className="rounded-xl"
            >
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>
        </Section>

        <Section title="Your data" desc={`${entries.length} entries stored locally on this device.`}>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-xl" onClick={handleExport}>
              <Download className="mr-1.5 h-4 w-4" /> Export JSON
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="mr-1.5 h-4 w-4" /> Import JSON
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImport(f);
                e.target.value = "";
              }}
            />
            <Button
              variant="ghost"
              className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleClear}
            >
              <Trash2 className="mr-1.5 h-4 w-4" /> Clear all data
            </Button>
          </div>
        </Section>
      </div>
    </AppShell>
  );
}

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
      <div className="mb-5">
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      {children}
    </section>
  );
}
