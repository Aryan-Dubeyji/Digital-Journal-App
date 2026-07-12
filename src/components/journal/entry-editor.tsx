import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOODS, type JournalEntry } from "@/lib/journal/types";
import { useJournal } from "@/lib/journal/store";
import { Heart, Pin, Tag as TagIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: JournalEntry | null;
}

export function EntryEditor({ open, onOpenChange, entry }: Props) {
  const { createEntry, updateEntry, settings } = useJournal();
  const editing = !!entry;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Personal");
  const [mood, setMood] = useState<JournalEntry["mood"]>("neutral");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(entry?.title ?? "");
      setContent(entry?.content ?? "");
      setCategory(entry?.category ?? settings.categories[0] ?? "Personal");
      setMood(entry?.mood ?? "neutral");
      setTags(entry?.tags ?? []);
      setTagInput("");
      setFavorite(entry?.favorite ?? false);
      setPinned(entry?.pinned ?? false);
    }
  }, [open, entry, settings.categories]);

  const wordCount = useMemo(
    () => (content.trim() ? content.trim().split(/\s+/).length : 0),
    [content],
  );

  const commitTag = () => {
    const t = tagInput.trim().replace(/^#/, "");
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const handleSave = () => {
    const payload = {
      title: title.trim() || "Untitled entry",
      content,
      category,
      mood,
      tags,
      favorite,
      pinned,
    };
    if (editing && entry) {
      updateEntry(entry.id, payload);
    } else {
      createEntry(payload);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0 sm:rounded-2xl">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="font-display text-xl font-semibold">
            {editing ? "Edit entry" : "New entry"}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give this moment a title…"
            className="!border-0 !bg-transparent px-0 !text-2xl font-display font-medium tracking-tight shadow-none focus-visible:!ring-0"
          />

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing. Whatever's on your mind."
            rows={10}
            className="mt-2 min-h-[240px] resize-none !border-0 !bg-transparent px-0 text-base leading-relaxed shadow-none focus-visible:!ring-0"
          />

          {/* Meta row */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1.5 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {settings.categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Mood
              </Label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {MOODS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMood(m.value)}
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded-xl border text-lg transition",
                      mood === m.value
                        ? "border-primary bg-accent shadow-[var(--shadow-soft)]"
                        : "border-border hover:bg-secondary",
                    )}
                    title={m.label}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Tags</Label>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-xs text-accent-foreground"
                >
                  <TagIcon className="h-3 w-3" />
                  {t}
                  <button
                    onClick={() => setTags(tags.filter((x) => x !== t))}
                    className="ml-0.5 opacity-60 hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    commitTag();
                  }
                  if (e.key === "Backspace" && !tagInput && tags.length) {
                    setTags(tags.slice(0, -1));
                  }
                }}
                onBlur={commitTag}
                placeholder={tags.length ? "" : "Add a tag and press Enter"}
                className="min-w-[120px] flex-1 bg-transparent text-sm outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border bg-surface px-6 py-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <button
              onClick={() => setFavorite((v) => !v)}
              className={cn(
                "grid h-8 w-8 place-items-center rounded-lg transition",
                favorite ? "text-primary" : "hover:bg-secondary",
              )}
              title="Favorite"
            >
              <Heart className={cn("h-4 w-4", favorite && "fill-current")} />
            </button>
            <button
              onClick={() => setPinned((v) => !v)}
              className={cn(
                "grid h-8 w-8 place-items-center rounded-lg transition",
                pinned ? "text-primary" : "hover:bg-secondary",
              )}
              title="Pin"
            >
              <Pin className={cn("h-4 w-4", pinned && "fill-current")} />
            </button>
            <span className="ml-2">{wordCount} words</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="rounded-xl">
              {editing ? "Save changes" : "Save entry"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
