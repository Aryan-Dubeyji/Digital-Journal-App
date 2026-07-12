import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  endOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/journal/app-shell";
import { EntryCard } from "@/components/journal/entry-card";
import { useJournal } from "@/lib/journal/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar · Marginalia" },
      { name: "description", content: "Revisit your journal by date." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const { entries } = useJournal();
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState<Date | null>(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const byDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of entries) {
      const key = format(new Date(e.createdAt), "yyyy-MM-dd");
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [entries]);

  const selectedEntries = useMemo(() => {
    if (!selected) return [];
    return entries
      .filter((e) => isSameDay(new Date(e.createdAt), selected))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [entries, selected]);

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">Calendar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every dot is a day you wrote. Tap one to revisit.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-xl" onClick={() => setCursor(subMonths(cursor, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-[160px] text-center font-display text-lg font-medium">
            {format(cursor, "MMMM yyyy")}
          </div>
          <Button variant="outline" size="icon" className="rounded-xl" onClick={() => setCursor(addMonths(cursor, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:p-6">
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="py-2">{d}</div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const count = byDay.get(key) ?? 0;
            const inMonth = isSameMonth(day, cursor);
            const isSel = selected && isSameDay(day, selected);
            const isToday = isSameDay(day, new Date());
            return (
              <button
                key={key}
                onClick={() => setSelected(day)}
                className={cn(
                  "group relative aspect-square rounded-xl p-1.5 text-left transition sm:p-2",
                  inMonth ? "hover:bg-secondary" : "opacity-40",
                  isSel && "bg-accent ring-2 ring-primary",
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                    isToday && "bg-primary text-primary-foreground",
                  )}
                >
                  {format(day, "d")}
                </div>
                {count > 0 && (
                  <div className="absolute bottom-1.5 left-1.5 flex gap-0.5">
                    {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                      <span key={i} className="h-1.5 w-1.5 rounded-full bg-primary" />
                    ))}
                    {count > 3 && (
                      <span className="text-[10px] font-medium text-primary">+{count - 3}</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold">
          {selected ? format(selected, "EEEE, MMMM d") : "Pick a date"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {selectedEntries.length
            ? `${selectedEntries.length} ${selectedEntries.length === 1 ? "entry" : "entries"}`
            : "No entries this day — a fine day to start."}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {selectedEntries.map((e) => (
            <EntryCard key={e.id} entry={e} compact />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
