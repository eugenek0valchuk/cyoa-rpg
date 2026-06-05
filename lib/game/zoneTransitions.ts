import { zoneTransitionCopy } from '@/locales/ru/zoneTransitions'

import type { Scene } from '@/lib/types/game'
import type { RaidZone } from './zones'

const ZONE_ORDER: RaidZone[] = ['surface', 'depth', 'fracture', 'collapse']

export const ZONE_BRIDGE_CONTINUE_ID = 'zone_bridge_continue'

function zoneRank(zone: RaidZone): number {
  return ZONE_ORDER.indexOf(zone)
}

export function getZoneBridgeId(from: RaidZone, to: RaidZone): string {
  return `zone_bridge_${from}_${to}`
}

export function isZoneBridgeScene(sceneId: string): boolean {
  return sceneId.startsWith('zone_bridge_')
}

export function shouldInsertZoneBridge(
  from: RaidZone,
  to: RaidZone,
  visitedSceneIds: Set<string>,
): boolean {
  if (zoneRank(to) <= zoneRank(from)) {
    return false
  }

  const bridgeId = getZoneBridgeId(from, to)

  if (visitedSceneIds.has(bridgeId)) {
    return false
  }

  return Boolean(zoneTransitionCopy[`${from}_${to}` as keyof typeof zoneTransitionCopy])
}

export function createZoneBridgeScene(from: RaidZone, to: RaidZone): Scene | null {
  const copy = zoneTransitionCopy[`${from}_${to}` as keyof typeof zoneTransitionCopy]

  if (!copy) {
    return null
  }

  return {
    id: getZoneBridgeId(from, to),
    title: copy.title,
    description: copy.description,
    options: [
      {
        id: ZONE_BRIDGE_CONTINUE_ID,
        text: copy.continue,
      },
    ],
  }
}

export function wrapSceneWithZoneBridge(
  nextScene: Scene,
  depthBefore: number,
  depthAfter: number,
  corruption: number,
  visitedSceneIds: Set<string>,
  getZone: (depth: number, corruption: number) => RaidZone,
): { scene: Scene; queuedScene: Scene | null } {
  const from = getZone(depthBefore, corruption)
  const to = getZone(depthAfter, corruption)

  if (!shouldInsertZoneBridge(from, to, visitedSceneIds)) {
    return { scene: nextScene, queuedScene: null }
  }

  const bridge = createZoneBridgeScene(from, to)

  if (!bridge) {
    return { scene: nextScene, queuedScene: null }
  }

  return { scene: bridge, queuedScene: nextScene }
}
