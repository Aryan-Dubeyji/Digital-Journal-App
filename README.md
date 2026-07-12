# NAME- ARYAN DUBEY
# INTER ID- CITS2373
# NO. OF WEEKS- 6
# Project Name: Marginalia — A Quiet Digital Journal

# Project Scope

Marginalia is a modern, frontend-only digital journaling app built as a college
frontend project. It focuses on calm, distraction-free writing with a polished
UI, thoughtful animations, and a fully local data model — nothing ever leaves
your device.

## Project Overview

- **Type**: Single-page frontend application
- **Persistence**: Browser `localStorage` (no backend, no authentication)
- **Design goals**: Elegant, minimal, portfolio-quality UI inspired by Apple
  Notes, Day One, Reflect, and Journey.

## Features

- **Dashboard** — total entries, weekly count, writing streak, favorites,
  30-day activity chart, and mood distribution.
- **Journal management** — create, edit, delete, duplicate, pin, favorite.
- **Rich metadata** — title, multiline content, category, tags, mood emoji,
  timestamps.
- **Categories** — Personal, Work, Study, Travel, Ideas, Daily Reflection +
  custom categories.
- **Global search** — titles, content, tags, and categories.
- **Filters & sorting** — by category, favorites, pinned; newest / oldest /
  recently edited.
- **Calendar view** — month grid with dots on days you wrote; click a day to
  see its entries.
- **Settings** — light / dark mode, six accent colors, three font sizes,
  export / import JSON, clear local data.
- **Demo data** — the app ships with 10 realistic sample entries on first
  launch so the UI feels alive immediately.

## Technology Stack

- **React 19** + **TypeScript**
- **TanStack Start / Router** (file-based routing with SSR shell)
- **Vite 8**
- **Tailwind CSS v4** (CSS-first `@theme`, `oklch` tokens)
- **shadcn/ui** (Radix UI primitives)
- **Framer Motion** (page + card animations)
- **Recharts** (activity + mood charts)
- **date-fns** (calendar math)
- **Lucide React** (icons)
- **Sonner** (toast notifications)
- **localStorage** (all persistence)

## Installation

```bash
bun install
bun run dev
```

Then open `http://localhost:8080`.

To build for production:

```bash
bun run build
```

## Usage

1. Open the app — a dashboard appears with seeded demo entries.
2. Click **New entry** in the sidebar (or the `+` in the header) to write.
3. Use **Entries** to search, filter, sort, and manage all writing.
4. Use **Calendar** to browse by date.
5. Use **Settings** to change theme, accent, font size, or export/import your
   journal as JSON.

All data lives in `localStorage` under the keys `journal:entries:v1` and
`journal:settings:v1`. Clearing browser storage resets the app.

## Future Improvements

- Rich-text editor with markdown shortcuts and image attachments
- Full-text search with highlighting and fuzzy matching
- Weekly / monthly review screens with prompts
- Optional passphrase-based local encryption
- PWA installability and offline-first icons
- Sync via WebDAV / Google Drive as an opt-in extension
