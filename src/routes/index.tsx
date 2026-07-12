import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format, isThisWeek, startOfDay, subDays } from "date-fns";
import { BookOpen, Flame, Heart, TrendingUp, Sparkles } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/journal/app-shell";
import { EntryCard } from "@/components/journal/entry-card";
import { computeStreak, useJournal } from "@/lib/journal/store";
import { MOODS } from "@/lib/journal/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · Marginalia" },
      { name: "description", content: "Your journaling dashboard — streaks, moods, and recent reflections." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { entries, hydrated } = useJournal();

  const stats = useMemo(() => {
    const total = entries.length;
    const week = entries.filter((e) => isThisWeek(new Date(e.createdAt), { weekStartsOn: 1 })).length;
    const favorites = entries.filter((e) => e.favorite).length;
    const streak = computeStreak(entries);
    return { total, week, favorites, streak };
  }, [entries]);

  const activity = useMemo(() => {
    const days: { label: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = startOfDay(subDays(new Date(), i));
      const count = entries.filter(
        (e) => startOfDay(new Date(e.createdAt)).getTime() === d.getTime(),
      ).length;
      days.push({ label: format(d, "MMM d"), count });
    }
    return days;
  }, [entries]);

  const moods = useMemo(() => {
    return MOODS.map((m) => ({
      name: m.emoji,
      value: entries.filter((e) => e.mood === m.value).length,
    })).filter((m) => m.value > 0);
  }, [entries]);

  const recent = useMemo(
    () =>
      [...entries]
        .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
        .slice(0, 4),
    [entries],
  );

  const pinned = useMemo(() => entries.filter((e) => e.pinned), [entries]);
  const favorites = useMemo(() => entries.filter((e) => e.favorite).slice(0, 3), [entries]);

  const today = format(new Date(), "EEEE, MMMM d");

  return (
    <AppShell>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{today}</div>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          <span className="ink-gradient">Good to see you back.</span>
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          A quick look at your writing rhythm, the moods you've moved through, and the pages you keep returning to.
        </p>
      </motion.div>

      {/* Stat tiles */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatTile icon={BookOpen} label="Total entries" value={stats.total} accent="from-primary/20 to-transparent" />
        <StatTile icon={TrendingUp} label="This week" value={stats.week} accent="from-chart-2/25 to-transparent" />
        <StatTile icon={Flame} label="Day streak" value={stats.streak} accent="from-chart-5/25 to-transparent" suffix={stats.streak === 1 ? "day" : "days"} />
        <StatTile icon={Heart} label="Favorites" value={stats.favorites} accent="from-chart-4/25 to-transparent" />
      </div>

      {/* Chart + moods */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">Writing activity</h2>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </div>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activity} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  interval={4}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#fill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h2 className="font-display text-lg font-semibold">Mood distribution</h2>
          <p className="text-xs text-muted-foreground">Across all entries</p>
          <div className="mt-4 h-48">
            {moods.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moods} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 16 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="value" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyMini label="No moods yet" />
            )}
          </div>
        </div>
      </div>

      {/* Pinned */}
      {pinned.length > 0 && (
        <section className="mt-10">
          <SectionHeader title="Pinned" subtitle="Kept close for a reason" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <AnimatePresence>
              {pinned.map((e) => (
                <EntryCard key={e.id} entry={e} compact />
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Recent */}
      <section className="mt-10">
        <SectionHeader title="Recently edited" subtitle="Your latest thinking" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {hydrated && recent.length === 0 ? (
            <EmptyState />
          ) : (
            <AnimatePresence>
              {recent.map((e) => (
                <EntryCard key={e.id} entry={e} compact />
              ))}
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Favorites */}
      {favorites.length > 0 && (
        <section className="mt-10">
          <SectionHeader title="Favorites" subtitle="Entries you love" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <AnimatePresence>
              {favorites.map((e) => (
                <EntryCard key={e.id} entry={e} compact />
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}
    </AppShell>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  suffix,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  suffix?: string;
  accent?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]"
    >
      <div className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${accent}`} />
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="font-display text-3xl font-semibold tracking-tight">{value}</span>
        {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
      </div>
    </motion.div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
        <BookOpen className="h-5 w-5" />
      </div>
      <p className="mt-3 font-display text-lg">Your notebook is quiet.</p>
      <p className="text-sm text-muted-foreground">Start with one honest sentence.</p>
    </div>
  );
}

function EmptyMini({ label }: { label: string }) {
  return (
    <div className="grid h-full place-items-center text-sm text-muted-foreground">{label}</div>
  );
}
