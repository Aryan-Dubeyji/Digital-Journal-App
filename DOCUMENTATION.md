# Marginalia — Technical Documentation

## 1. Project Overview

Marginalia is a frontend-only Digital Journal App designed to deliver a
commercial-quality journaling experience without any backend infrastructure.
All user data — entries, categories, and preferences — is persisted in the
browser via `localStorage`. The application emphasizes visual polish,
responsive design, accessibility, and a clean, modular codebase suitable for
academic evaluation of frontend engineering skill.

## 2. Objectives

- Deliver a distraction-free, elegant journaling interface.
- Demonstrate mastery of a modern React + TypeScript stack.
- Persist all data locally, with export / import for portability.
- Achieve production-quality UX: animation, responsiveness, accessibility.
- Ship a modular, typed codebase that reads like a real product.

## 3. System Architecture

Marginalia is a client-rendered SPA served through the TanStack Start Vite
plugin. There is no server-side business logic — the only server responsibility
is delivering the static shell and hydrating the client-side router.


## 5. Component Architecture

- **AppShell** — persistent sidebar + main content region. Holds the primary
  "New entry" action and mounts the global `EntryEditor` dialog.
- **EntryCard** — animated, hover-elevated card representing a single entry.
  Owns its own edit dropdown and mounts an `EntryEditor` in edit mode.
- **EntryEditor** — modal dialog for creating or updating an entry. Manages
  local form state, hydrates from the passed `entry` prop, and calls
  `createEntry` / `updateEntry` on save.
- **Dashboard widgets** — StatTile, SectionHeader, EmptyState, and inline
  Recharts wrappers.

Components are intentionally small and composable. No component reaches into
localStorage directly — all reads and writes go through the `useJournal` hook.

## 6. Routing Structure

TanStack Router uses filename-based routes. Each route file declares its own
`head()` with a route-specific title and description for good SEO defaults.

| File                     | URL         | Purpose                          |
| ------------------------ | ----------- | -------------------------------- |
| `routes/__root.tsx`      | shell       | HTML head, providers, Toaster    |
| `routes/index.tsx`       | `/`         | Dashboard                        |
| `routes/entries.tsx`     | `/entries`  | Entry list with search / filters |
| `routes/calendar.tsx`    | `/calendar` | Month-grid calendar view         |
| `routes/settings.tsx`    | `/settings` | Appearance + data management     |

## 7. State Management

State is centralized in a single React Context (`JournalProvider`, in
`lib/journal/store.tsx`). It exposes:

- **State**: `entries`, `settings`, `hydrated`.
- **Actions**: `createEntry`, `updateEntry`, `deleteEntry`, `duplicateEntry`,
  `toggleFavorite`, `togglePinned`, `addCategory`, `removeCategory`,
  `updateSettings`, `clearAll`, `exportJson`, `importJson`.
- **Derived**: `computeStreak(entries)` for the writing-streak stat.

React Query is present in the template but is not used for journal data —
it would be overkill for purely local state. It stays available for any future
async surface.

## 8. Local Storage & Data Flow

Two writes happen through `useEffect`:

1. Whenever `entries` change, the array is serialized to
   `journal:entries:v1`.
2. Whenever `settings` change, they are serialized to `journal:settings:v1`,
   and the theme class / accent hue / font size are applied to
   `document.documentElement`.

On first mount, if `journal:seeded:v1` is not set and no entries exist, the
demo data set (`DEMO_ENTRIES`) is loaded and marked as seeded so it does not
re-seed after the user clears everything.

Reads happen inside a `useEffect` (never during render) to remain SSR-safe:
this avoids hydration mismatches when TanStack Start renders the shell on the
server where `window` is undefined.

## 9. UI Design Decisions

- **Typography**: Display font `Fraunces` paired with `Inter` body. Serif
  headlines evoke a physical journal without drifting into pastiche.
- **Color system**: Semantic tokens (`--primary`, `--surface`, `--ink`, etc.)
  defined as `oklch()` values, mapped through Tailwind's `@theme inline`.
  Users pick from six accent palettes (Amber, Rose, Sage, Ocean, Violet,
  Ink); the accent hue is applied by mutating a single CSS custom property.
- **Motion**: Framer Motion drives layout transitions in the sidebar,
  card entry / exit, and subtle hover lifts. Motion is restrained — a
  journaling app should feel calm.
- **Cards**: rounded-2xl surfaces with soft dual-layer shadows, glassy hover
  transitions, and generous padding.
- **Charts**: Recharts styled to match token colors, no gridlines on the y
  axis, and gradient area fills for the activity chart.

## 10. Feature Breakdown

- **Dashboard** (`/`) — Streak, weekly total, favorites count, 30-day
  area chart, mood distribution bar chart, pinned / recent / favorites strips.
- **Entries** (`/entries`) — Search across title / body / tags / category,
  category filter, sort by newest / oldest / recently edited, tabs for
  All / Favorites / Pinned. Pinned entries float to the top.
- **Calendar** (`/calendar`) — Month grid with dot markers per day (up to
  three dots + overflow count). Selecting a day renders its entries below.
- **Entry editor** — Title, mood picker, category select, chip-based tags,
  favorite + pin toggles, live word count.
- **Settings** — Theme, accent, font size, category CRUD, JSON
  export/import, destructive "Clear all data" with confirmation.

## 11. Third-Party Libraries

| Library         | Purpose                              |
| --------------- | ------------------------------------ |
| React 19        | UI runtime                           |
| TypeScript      | Static typing                        |
| TanStack Router | File-based client routing            |
| Tailwind CSS v4 | Utility-first styling                |
| shadcn/ui       | Accessible Radix-based primitives    |
| Framer Motion   | Animation + layout transitions       |
| Recharts        | Activity + mood charts               |
| date-fns        | Calendar math, formatting            |
| Lucide React    | Iconography                          |
| Sonner          | Toast notifications                  |

## 12. Responsive Design Strategy

- Mobile-first Tailwind utility classes.
- Sidebar collapses into a horizontal, scrollable navigation row below the
  `lg` breakpoint.
- Main content is capped at `max-w-5xl` for readability on large screens.
- Cards reflow from single column on mobile to two columns from `sm:` and up.
- The calendar grid always stays 7 columns; day cells are `aspect-square`
  and scale down gracefully.

## 13. Performance Optimizations

- **Local-only data** — no network round-trips.
- **Context memoization** — the exposed context value is memoized to avoid
  re-rendering every consumer on unrelated updates.
- **`useMemo` derivations** for filtering, sorting, calendar day maps, and
  chart datasets.
- **Layout animations** are scoped to a small number of elements (sidebar
  active indicator, entry cards) to keep the main thread free.
- **Tailwind v4 lightning CSS** produces a small, tree-shaken stylesheet.

## 14. Accessibility Considerations

- Semantic landmarks (`nav`, `main`, `aside`, `article`, `section`).
- All actionable elements are real buttons or links; keyboard focus rings
  are preserved via the token-driven `--ring` color.
- Radix-based dialogs, dropdowns, and selects come with correct ARIA roles
  and focus trapping.
- Toast notifications from Sonner are announced via `aria-live`.
- Color contrast is validated against WCAG AA for both light and dark
  themes.

## 15. Limitations

- Data is confined to a single browser profile — clearing storage or using a
  different device erases the journal (mitigated by JSON export).
- The editor is plain-text; no markdown rendering or image attachments yet.
- No end-to-end encryption. The data is not sent anywhere, but any code on
  the same origin could read it.
- Search is substring-based; no fuzzy matching or ranking.

## 16. Future Enhancements

- Rich-text or markdown editor with slash commands.
- Weekly and yearly review screens with reflection prompts.
- Optional passphrase-based encryption of `localStorage` payloads.
- PWA manifest + service worker for full offline installability.
- Optional cloud sync (WebDAV, Drive) delivered as a pluggable module.
- Full-text search with highlighted matches.

## 17. Conclusion

Marginalia demonstrates that a frontend-only application can deliver the feel
of a real, shipped product when engineering discipline and design intent are
applied consistently. The codebase is intentionally small, strongly typed, and
composed of focused modules — an approachable reference for how a modern React
application can be architected without leaning on a backend.
