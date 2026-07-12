import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen, LayoutDashboard, CalendarDays, Settings, PenLine, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useJournal } from "@/lib/journal/store";
import { useState, type ReactNode } from "react";
import { EntryEditor } from "@/components/journal/entry-editor";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/entries", label: "Entries", icon: BookOpen },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { entries } = useJournal();
  const [composing, setComposing] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="border-b border-border lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col p-5">
            <Link to="/" className="flex items-center gap-2.5 px-2 py-1.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent-foreground/60 shadow-[var(--shadow-soft)]">
                <PenLine className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <div className="font-display text-lg font-semibold tracking-tight">Marginalia</div>
                <div className="text-xs text-muted-foreground">Your quiet notebook</div>
              </div>
            </Link>

            <Button
              onClick={() => setComposing(true)}
              className="mt-6 gap-2 rounded-xl shadow-[var(--shadow-soft)]"
              size="lg"
            >
              <Sparkles className="h-4 w-4" />
              New entry
            </Button>

            <nav className="mt-8 flex flex-row gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
              {NAV.map(({ to, label, icon: Icon }) => {
                const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-xl bg-secondary"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto hidden lg:block">
              <div className="rounded-2xl border border-border bg-surface p-4">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Library
                </div>
                <div className="mt-1 font-display text-2xl">{entries.length}</div>
                <div className="text-xs text-muted-foreground">entries and counting</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
            {children}
          </div>
        </main>
      </div>

      <EntryEditor open={composing} onOpenChange={setComposing} />
    </div>
  );
}
