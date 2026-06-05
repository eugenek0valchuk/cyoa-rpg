# Game API

TypeScript reference for the handcrafted narrative engine in `lib/game/`.

## Modules

| Area | Path | Role |
|------|------|------|
| Raid loop | `lib/game/raid.ts` | Hub → descent → extraction |
| Scene director | `lib/game/sceneDirector.ts` | Scene selection, pools, zone pacing |
| Choices | `lib/game/handleChoice.ts` | Apply effects, resolve next scene |
| Hub meta | `lib/game/hubMeta.ts` | Echo, room marks, vessel progression |
| Persistence | `lib/persistence/` | IndexedDB save slots |
| Types | `lib/types/` | `Character`, `Scene`, `RaidState`, hub models |

## Generate docs

```bash
npm run docs
```

Output: `docs/api/` (gitignored).
