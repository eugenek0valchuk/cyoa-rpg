import { sceneRegistry } from './sceneRegistry'
import { EXTRACTION_SITES, SIGIL_EXTRACTION_SITES } from './extraction'
import type { RaidZone } from './zones'

export type SceneMapZone = RaidZone | 'event'

export type SceneMapNode = {
  id: string
  label: string
  zone: SceneMapZone
  x: number
  y: number
  isExit?: boolean
}

/** Позиции ключевых узлов для мини-карты (логическая схема, не география 1:1). */
const SPINE_LAYOUT: Record<
  string,
  { x: number; y: number; zone: SceneMapZone; label?: string }
> = {
  start: { x: 1, y: 0, zone: 'surface', label: 'Дорога' },
  remembered_path: { x: 1, y: 1, zone: 'surface', label: 'Память' },
  merchant: { x: 0, y: 1, zone: 'surface', label: 'Телега' },
  leave_cart: { x: 0, y: 2, zone: 'surface' },
  monastery: { x: 2, y: 1, zone: 'surface', label: 'Монастырь' },
  bell: { x: 2, y: 2, zone: 'surface', label: 'Колокол' },
  exit_monastery: { x: 3, y: 1, zone: 'surface', label: 'Выход' },
  mouth: { x: 1, y: 2, zone: 'surface', label: 'Уста' },
  descent: { x: 1, y: 3, zone: 'depth', label: 'Спуск' },
  iron_passage: { x: 0, y: 4, zone: 'depth' },
  stone_path: { x: 0, y: 5, zone: 'depth' },
  catacombs: { x: 2, y: 4, zone: 'depth', label: 'Катакомбы' },
  jump_pit: { x: 1, y: 5, zone: 'depth', label: 'Яма' },
  pit_lip: { x: 2, y: 5, zone: 'depth' },
  submerged_crypt: { x: 3, y: 5, zone: 'fracture' },
  drain_water: { x: 4, y: 4, zone: 'fracture', label: 'Сток' },
  fracture_stairs: { x: 1, y: 6, zone: 'fracture' },
  fracture_choir: { x: 2, y: 6, zone: 'fracture', label: 'Хор' },
  whispers_parlor: { x: 3, y: 3, zone: 'depth' },
  whispers_mirror: { x: 4, y: 3, zone: 'fracture' },
  communion_vein: { x: 0, y: 7, zone: 'collapse' },
  communion_throne: { x: 1, y: 7, zone: 'collapse' },
  ash_path: { x: 2, y: 7, zone: 'collapse', label: 'Пепел' },
  collapse_threshold: { x: 1, y: 8, zone: 'collapse' },
  collapse_maw: { x: 2, y: 8, zone: 'collapse' },
  encounter_wax_pilgrim: { x: 0, y: 3, zone: 'event', label: 'Воск' },
  encounter_bell_wretch: { x: 3, y: 2, zone: 'event', label: 'Урод' },
  encounter_choir_remnant: { x: 3, y: 6, zone: 'event', label: 'Осколок' },
  encounter_synod_acolyte: { x: 0, y: 0, zone: 'event', label: 'Синод' },
  encounter_heretic_cog: { x: 3, y: 5, zone: 'event', label: 'Шестерня' },
  sarcophagus_tunnel: { x: 0, y: 6, zone: 'fracture' },
  blood_path: { x: 2, y: 5, zone: 'depth' },
}

function resolveTargetSceneId(
  sceneId: string,
  optionId: string,
  targetSceneId?: string,
): string | null {
  const target = targetSceneId ?? optionId
  return sceneRegistry[target] ? target : null
}

export function buildSceneAdjacency(): Map<string, Set<string>> {
  const adjacency = new Map<string, Set<string>>()

  const link = (from: string, to: string) => {
    if (!sceneRegistry[from] || !sceneRegistry[to]) {
      return
    }

    if (!adjacency.has(from)) {
      adjacency.set(from, new Set())
    }
    if (!adjacency.has(to)) {
      adjacency.set(to, new Set())
    }

    adjacency.get(from)!.add(to)
    adjacency.get(to)!.add(from)
  }

  for (const scene of Object.values(sceneRegistry)) {
    for (const option of scene.options) {
      const target = resolveTargetSceneId(
        scene.id,
        option.id,
        option.targetSceneId,
      )

      if (target) {
        link(scene.id, target)
      }
    }
  }

  return adjacency
}

export function getSceneMapNodes(): SceneMapNode[] {
  const nodes: SceneMapNode[] = []

  for (const [id, layout] of Object.entries(SPINE_LAYOUT)) {
    if (!sceneRegistry[id]) {
      continue
    }

    const scene = sceneRegistry[id]
    nodes.push({
      id,
      label: layout.label ?? scene.title.slice(0, 14),
      zone: layout.zone,
      x: layout.x,
      y: layout.y,
      isExit:
        EXTRACTION_SITES.has(id) ||
        SIGIL_EXTRACTION_SITES.has(id),
    })
  }

  return nodes
}

export function getNeighbors(
  sceneId: string,
  adjacency = buildSceneAdjacency(),
): string[] {
  return [...(adjacency.get(sceneId) ?? [])].sort()
}

export function canNavigateOnMap(
  currentSceneId: string,
  targetSceneId: string,
  visitedSceneIds: Set<string>,
  adjacency = buildSceneAdjacency(),
): boolean {
  if (currentSceneId === targetSceneId) {
    return false
  }

  if (!visitedSceneIds.has(targetSceneId)) {
    return false
  }

  return adjacency.get(currentSceneId)?.has(targetSceneId) ?? false
}

export function findHistoryRewindIndex(
  targetSceneId: string,
  sceneHistory: { id: string }[],
): number | null {
  for (let index = sceneHistory.length - 1; index >= 0; index -= 1) {
    if (sceneHistory[index]?.id === targetSceneId) {
      return index
    }
  }

  return null
}
