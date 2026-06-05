# The Last Echo

Browser-based gothic horror CYOA RPG with handcrafted branching narrative.

Built with Next.js, TypeScript, Zustand, and Tailwind CSS.

## Features

- Character editor (origin, stats, inventory)
- Handwritten scene graph with curated scene pools for replay variety
- Director system that escalates story by corruption and history
- Multiple endings driven by flags, origin, and mental state
- Auto-save and multiple save slots (IndexedDB)
- Responsive dark-themed UI

## Tech Stack

- Next.js App Router
- TypeScript (strict)
- Zustand (global state)
- Tailwind + custom gothic UI components
- Framer Motion

## Getting Started

```bash
git clone ...
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | Playwright E2E |
| `npm run docs` | TypeDoc API reference (`lib/game/`, `lib/persistence/`, `lib/types/`) |

## Documentation

- [Roadmap](docs/ROADMAP.md)
- [Lore](docs/LORE.md)
- Game API: `npm run docs` → `docs/api/`
