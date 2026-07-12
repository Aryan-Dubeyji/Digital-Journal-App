import { motion } from "framer-motion";
import { format } from "date-fns";
import { Heart, Pin, MoreHorizontal, Copy, Trash2, Pencil } from "lucide-react";
import { MOODS, type JournalEntry } from "@/lib/journal/types";
import { useJournal } from "@/lib/journal/store";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { EntryEditor } from "./entry-editor";

interface Props {
  entry: JournalEntry;
  compact?: boolean;
}

export function EntryCard({ entry, compact }: Props) {
  const { toggleFavorite, togglePinned, duplicateEntry, deleteEntry } = useJournal();
  const [editing, setEditing] = useState(false);
  const mood = MOODS.find((m) => m.value === entry.mood);

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        onClick={() => setEditing(true)}
        className={cn(
          "group relative cursor-pointer rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-elevated)]",
          compact && "p-4",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center rounded-md bg-accent px-2 py-0.5 text-accent-foreground">
                {entry.category}
              </span>
              <span>·</span>
              <span>{format(new Date(entry.createdAt), "MMM d, yyyy")}</span>
              {entry.pinned && (
                <>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 text-primary">
                    <Pin className="h-3 w-3 fill-current" /> Pinned
                  </span>
                </>
              )}
            </div>
            <h3
              className={cn(
                "mt-2 font-display font-semibold tracking-tight text-foreground",
                compact ? "text-lg" : "text-xl",
              )}
            >
              {entry.title}
            </h3>
            <p
              className={cn(
                "mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground",
                !compact && "line-clamp-3",
              )}
            >
              {entry.content}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {mood && (
                <span className="text-lg" title={mood.label}>
                  {mood.emoji}
                </span>
              )}
              {entry.tags.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => toggleFavorite(entry.id)}
              className={cn(
                "grid h-8 w-8 place-items-center rounded-lg transition",
                entry.favorite
                  ? "text-primary"
                  : "text-muted-foreground opacity-0 hover:bg-secondary group-hover:opacity-100",
              )}
              aria-label="Favorite"
            >
              <Heart className={cn("h-4 w-4", entry.favorite && "fill-current")} />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground opacity-0 transition hover:bg-secondary group-hover:opacity-100"
                  aria-label="More"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem onClick={() => setEditing(true)}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => togglePinned(entry.id)}>
                  <Pin className="mr-2 h-4 w-4" /> {entry.pinned ? "Unpin" : "Pin"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => duplicateEntry(entry.id)}>
                  <Copy className="mr-2 h-4 w-4" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => deleteEntry(entry.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.article>

      <EntryEditor open={editing} onOpenChange={setEditing} entry={entry} />
    </>
  );
}
