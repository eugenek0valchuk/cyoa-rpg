# Последнее Эхо — Roadmap

> Ветка разработки: `develop` · `main` — стабильные релизы

## Сделано (main)

- [x] Scene director без AI, русская локализация
- [x] Hub + raid loop, gated extraction (точки выхода / печать)
- [x] Hub UI: hotspots, модалки, нижняя панель
- [x] Post-raid summary (`/raid-summary`)
- [x] Exit сохраняет слот → главное меню; Begin → архивы
- [x] Stat icons + `npm run icons:process`

---

## Фаза 1 — Рейд как забег (приоритет)

**Цель:** спуск ощущается как рискованный run, а не прогулка.

| Задача | Описание |
|--------|----------|
| Prepare raid | Модалка «Порог»: briefing, правила извлечения, модификатор спуска |
| Raid modifiers | 1 случайный или выбираемый эффект на run (глухие колокола, кровавый туман…) |
| Zone map | Surface → Depth → Fracture → Collapse; director знает зону |
| Emergency extract | 1 раз за рейд: потерять часть добычи, выжить без точки выхода |
| Extract in-scene | На exit sites выбор «Отступить» в тексте сцены, не только кнопка |

**Файлы:** `lib/game/raid.ts`, `RaidState`, `sceneDirector.ts`, `locales/ru/scenes/`

---

## Фаза 2 — Encounters: враги и NPC (без CRPG-боя)

**Цель:** напряжение через narrative checks, не HP-бars.

| Задача | Описание |
|--------|----------|
| Encounter scenes | 5–8 сцен: STR / AGI / INT check → успех/провал → другая сцена |
| Named enemies | Wax Pilgrim, Choir Remnant, Bell Wretch |
| NPC v0 | Купец расширенный: trade hint, quest flag |
| RaidState | `encountersSeen`, `npcFlags` per run / hub meta |

**Формат:** `locales/ru/scenes/encounters.ts` + pools в director

---

## Фаза 3 — Hub meta-progression

**Цель:** камера влияет на геймплей, не только текст.

| Задача | Описание |
|--------|----------|
| Валюта «эхо» | С успешных извлечений |
| Upgrades | +loadout slot, sanity bonus, journal exit sites |
| roomMarks → mechanics | `deep_echo`, `failure_stain` меняют модификаторы |
| Origin perks | hollow / heretic / witness — разный старт модификатора |

---

## Фаза 4 — Контент и граф сцен

**Цель:** нет петель, каждый спуск — путь.

| Задача | Описание |
|--------|----------|
| Zone graph | Явные маршруты вместо random pool shuffle |
| Transition scenes | 1–2 generic-коридора на зону при занятом direct-scene |
| Content audit | Таблица scene → zone → loot → exit |

---

## Фаза 5 — UI / UX polish

| Задача | Описание |
|--------|----------|
| Main menu | Full-screen, превью последнего слота |
| Tooltip kit | `LorePopover` на stats, relics, marks |
| Editor | Intro-сцена origin перед hub |
| 2K pass | Icon scale, typography audit |

---

## Фаза 6 — Corruption & artifacts (gameplay)

| Задача | Описание |
|--------|----------|
| Corruption stages | Скрытые choices, variant text |
| Artifact passives | Loadout меняет правила run |
| Journal | Найденные exit sites навсегда в hub |

---

## Решения (открытые)

1. **Combat:** только checks (рекомендуется) vs лёгкий ресурс «стойкость»
2. **Permadeath персонажа:** только raid reset (текущее) vs смерть сосуда
3. **Procedural vs handcrafted:** гибрид — фиксированные зоны + pools внутри

---

## Ближайший спринт (develop)

1. Prepare raid modal + 1 raid modifier
2. 3 encounter-сцены + director hook
3. Zone field в `RaidState` + отображение в summary

---

## Workflow

```
develop → feature/* → merge в develop → периодически merge develop → main
```

PR не используем; прямой push в `develop`.
