import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/journal/app-shell";
import { EntryCard } from "@/components/journal/entry-card";
import { Input } from "@/components/ui/input";
import { useJournal } from "@/lib/journal/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/entries")({
  head: () => ({
    meta: [
      { title: "Entries · Marginalia" },
      { name: "description", content: "Browse, search, and filter every entry in your journal." },
    ],
  }),
  component: EntriesPage,
});

function EntriesPage() {
  const { entries, settings } = useJournal();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<"new" | "old" | "updated">("new");
  const [tab, setTab] = useState<"all" | "favorites" | "pinned">("all");

  const filtered = useMemo(() => {
    let list = [...entries];
    if (tab === "favorites") list = list.filter((e) => e.favorite);
    if (tab === "pinned") list = list.filter((e) => e.pinned);
    if (category !== "all") list = list.filter((e) => e.category === category);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(s) ||
          e.content.toLowerCase().includes(s) ||
          e.tags.some((t) => t.toLowerCase().includes(s)) ||
          e.category.toLowerCase().includes(s),
      );
    }
    list.sort((a, b) => {
      if (sort === "new") return +new Date(b.createdAt) - +new Date(a.createdAt);
      if (sort === "old") return +new Date(a.createdAt) - +new Date(b.createdAt);
      return +new Date(b.updatedAt) - +new Date(a.updatedAt);
    });
    // Pinned first when sorted new/updated
    if (sort !== "old") {
      list.sort((a, b) => Number(b.pinned) - Number(a.pinned));
    }
    return list;
  }, [entries, q, category, sort, tab]);

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">Entries</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {entries.length} in your notebook · {filtered.length} shown
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search titles, tags, content…"
            className="h-11 rounded-xl pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-11 min-w-[150px] rounded-xl">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {settings.categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
            <SelectTrigger className="h-11 min-w-[140px] rounded-xl">
              <SlidersHorizontal className="mr-1 h-4 w-4 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Newest</SelectItem>
              <SelectItem value="old">Oldest</SelectItem>
              <SelectItem value="updated">Recently edited</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-5 inline-flex gap-1 rounded-xl border border-border bg-surface p-1">
        {(["all", "favorites", "pinned"] as const).map((t) => (
          <Button
            key={t}
            size="sm"
            variant="ghost"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg capitalize",
              tab === t && "bg-card shadow-[var(--shadow-soft)]",
            )}
          >
            {t}
          </Button>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <AnimatePresence>
          {filtered.map((e) => (
            <EntryCard key={e.id} entry={e} />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
            <p className="font-display text-lg">Nothing matches your filters.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try clearing the search or picking a different category.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
