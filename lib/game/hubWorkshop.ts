import { mergeJournalEntries } from '@/lib/game/journal'
import { getLoadoutSlotsForRoomLevel } from '@/lib/game/hubMeta'
import type { HubState } from '@/lib/types/hub'

export type HubMaterialId = 'iron_shard' | 'wax_seal' | 'choir_splinter' | 'folio_page'

export type HubBuildingId = 'chamber_lamp' | 'memory_shelf'

export type HubBuildingDef = {
  id: HubBuildingId
  title: string
  description: string
  maxLevel: number
  levels: {
    level: number
    cost: Partial<Record<HubMaterialId, number>>
    effect: string
  }[]
}

export const HUB_BUILDINGS: HubBuildingDef[] = [
  {
    id: 'chamber_lamp',
    title: 'Лампа камеры',
    description: 'Тёплый свет перед спуском — только баф, без цены в глубине.',
    maxLevel: 2,
    levels: [
      {
        level: 1,
        cost: { iron_shard: 2 },
        effect: '+3 рассудка на старт спуска',
      },
      {
        level: 2,
        cost: { iron_shard: 3, wax_seal: 1 },
        effect: '+6 рассудка на старт спуска',
      },
    ],
  },
  {
    id: 'memory_shelf',
    title: 'Полка памяти',
    description: 'Камера держит больше реликвий для следующего круга.',
    maxLevel: 1,
    levels: [
      {
        level: 1,
        cost: { wax_seal: 3, choir_splinter: 1 },
        effect: '+1 слот снаряжения навсегда',
      },
    ],
  },
]

export function getHubMaterials(hub: HubState): Record<string, number> {
  return { ...(hub.materials ?? {}) }
}

export function addHubMaterials(
  hub: HubState,
  gains: Partial<Record<HubMaterialId, number>>,
): HubState {
  const materials = getHubMaterials(hub)

  for (const [id, count] of Object.entries(gains)) {
    if (!count || count <= 0) {
      continue
    }

    materials[id] = (materials[id] ?? 0) + count
  }

  return { ...hub, materials }
}

export function getBuildingLevel(
  hub: HubState,
  buildingId: HubBuildingId,
): number {
  return hub.buildings?.[buildingId] ?? 0
}

export function canUpgradeBuilding(
  hub: HubState,
  buildingId: HubBuildingId,
): boolean {
  const def = HUB_BUILDINGS.find((entry) => entry.id === buildingId)
  if (!def) {
    return false
  }

  const current = getBuildingLevel(hub, buildingId)
  const next = def.levels.find((entry) => entry.level === current + 1)
  if (!next) {
    return false
  }

  const materials = getHubMaterials(hub)

  return Object.entries(next.cost).every(
    ([id, need]) => (materials[id] ?? 0) >= (need ?? 0),
  )
}

export function upgradeBuilding(
  hub: HubState,
  buildingId: HubBuildingId,
): HubState | null {
  const def = HUB_BUILDINGS.find((entry) => entry.id === buildingId)
  if (!def || !canUpgradeBuilding(hub, buildingId)) {
    return null
  }

  const current = getBuildingLevel(hub, buildingId)
  const next = def.levels.find((entry) => entry.level === current + 1)
  if (!next) {
    return null
  }

  const materials = { ...getHubMaterials(hub) }

  for (const [id, need] of Object.entries(next.cost)) {
    if (!need) {
      continue
    }

    materials[id] = (materials[id] ?? 0) - need
  }

  const buildings = { ...(hub.buildings ?? {}), [buildingId]: current + 1 }

  let nextHub: HubState = {
    ...hub,
    materials,
    buildings,
    loadoutSlots: getEffectiveLoadoutSlots({ ...hub, buildings }),
  }

  if (buildingId === 'chamber_lamp') {
    nextHub = {
      ...nextHub,
      workshopSanityBonus: getWorkshopSanityBonus(nextHub),
    }
  }

  return nextHub
}

export function getWorkshopSanityBonus(hub: HubState): number {
  const lamp = getBuildingLevel(hub, 'chamber_lamp')
  if (lamp >= 2) {
    return 6
  }

  if (lamp >= 1) {
    return 3
  }

  return hub.workshopSanityBonus ?? 0
}

export function getEffectiveLoadoutSlots(hub: HubState): number {
  const base = getLoadoutSlotsForRoomLevel(hub.roomLevel)
  const shelf = getBuildingLevel(hub, 'memory_shelf')
  return base + (shelf >= 1 ? 1 : 0)
}

export const FOLIO_FRAGMENT_IDS = ['folio_a', 'folio_b', 'folio_c'] as const

export type FolioFragmentId = (typeof FOLIO_FRAGMENT_IDS)[number]

export function getFolioFragments(hub: HubState): string[] {
  return hub.folioFragments ?? []
}

/** Для сохранений до folioFragments — восстанавливает текст по счётчику страниц. */
export function syncFolioFragments(hub: HubState): HubState {
  if ((hub.folioFragments?.length ?? 0) > 0) {
    return hub
  }

  const count = hub.materials?.folio_page ?? 0
  if (count <= 0) {
    return hub
  }

  return {
    ...hub,
    folioFragments: FOLIO_FRAGMENT_IDS.slice(0, count),
  }
}

export function countFolioPages(hub: HubState): number {
  const fromFragments = hub.folioFragments?.length ?? 0
  if (fromFragments > 0) {
    return fromFragments
  }

  return hub.materials?.folio_page ?? 0
}

export function addFolioFragment(
  hub: HubState,
): { hub: HubState; fragmentId: FolioFragmentId | null } {
  const existing = getFolioFragments(hub)
  const nextId = FOLIO_FRAGMENT_IDS.find((id) => !existing.includes(id))

  if (!nextId) {
    return { hub, fragmentId: null }
  }

  const materials = getHubMaterials(hub)

  return {
    hub: {
      ...hub,
      folioFragments: [...existing, nextId],
      materials: {
        ...materials,
        folio_page: existing.length + 1,
      },
    },
    fragmentId: nextId,
  }
}

export function canSolveFolioPuzzle(hub: HubState): boolean {
  return countFolioPages(hub) >= 3 && !hub.folioPuzzleSolved
}

export function solveFolioPuzzle(
  hub: HubState,
  answerId: string,
): { hub: HubState; correct: boolean } {
  if (!canSolveFolioPuzzle(hub)) {
    return { hub, correct: false }
  }

  const correct = answerId === 'machine_witness'

  if (!correct) {
    return { hub, correct: false }
  }

  const materials = { ...getHubMaterials(hub) }
  materials.folio_page = 0

  let nextHub: HubState = mergeJournalEntries(
    {
      ...hub,
      materials,
      folioFragments: [],
      folioPuzzleSolved: true,
      echo: (hub.echo ?? 0) + 4,
    },
    ['mystery_folio'],
  )

  return { hub: nextHub, correct: true }
}
