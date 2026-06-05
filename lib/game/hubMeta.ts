import type { HubState } from '@/lib/types/hub'

export const ECHO_REROLL_COST = 1
export const FREE_MODIFIER_REROLLS_ROOM_LEVEL = 3

/** Минимум рассудка в камере после провала / конца спуска */
export const HUB_SANITY_REST_MIN = 32

/** На сколько скверна спадает, когда сосуд возвращается в камеру после провала */
export const HUB_CORRUPTION_DECAY_ON_FAIL = 10

/** Не начинать спуск ниже этого порога — иначе мгновенный обвал */
export const MIN_RAID_START_SANITY = 12

export type RoomMarkEffect = {
  sanityStart?: number
  modifierHarsh?: boolean
  extraSanityPerScene?: number
  echoBonus?: number
}

export const ROOM_MARK_EFFECTS: Record<string, RoomMarkEffect> = {
  deep_echo: {
    sanityStart: -5,
    extraSanityPerScene: -1,
    echoBonus: 1,
  },
  failure_stain: {
    sanityStart: -6,
    modifierHarsh: true,
  },
  deep_wound: {
    sanityStart: -3,
  },
  first_spoils: {
    echoBonus: 1,
  },
}

export function getLoadoutSlotsForRoomLevel(roomLevel: number): number {
  if (roomLevel >= 3) {
    return 4
  }

  if (roomLevel >= 2) {
    return 3
  }

  return 2
}

export function syncHubProgression(hub: HubState): HubState {
  return {
    ...hub,
    loadoutSlots: getLoadoutSlotsForRoomLevel(hub.roomLevel),
  }
}

export function getRaidStartSanityDelta(roomMarks: string[]): number {
  return roomMarks.reduce((total, mark) => {
    return total + (ROOM_MARK_EFFECTS[mark]?.sanityStart ?? 0)
  }, 0)
}

export function hasHarshModifierPool(roomMarks: string[]): boolean {
  return roomMarks.includes('failure_stain')
}

export function hasDeepEchoDrain(roomMarks: string[]): boolean {
  return roomMarks.includes('deep_echo')
}

export function calcEchoFromExtraction(
  depth: number,
  newLootCount: number,
  roomMarks: string[],
): number {
  let echo = Math.max(1, depth)

  if (depth >= 6) {
    echo += 2
  }

  echo += newLootCount

  for (const mark of roomMarks) {
    echo += ROOM_MARK_EFFECTS[mark]?.echoBonus ?? 0
  }

  return echo
}

export function canAffordEchoReroll(hub: HubState): boolean {
  return (hub.echo ?? 0) >= ECHO_REROLL_COST
}

export function hasFreeModifierReroll(hub: HubState): boolean {
  return hub.roomLevel >= FREE_MODIFIER_REROLLS_ROOM_LEVEL
}

export function spendEcho(hub: HubState, amount: number): HubState | null {
  const echo = hub.echo ?? 0

  if (echo < amount) {
    return null
  }

  return { ...hub, echo: echo - amount }
}

export function applyRaidStartSanity(
  sanity: number,
  roomMarks: string[],
): number {
  const delta = getRaidStartSanityDelta(roomMarks)
  const adjusted = sanity + delta
  return Math.max(
    MIN_RAID_START_SANITY,
    Math.min(100, adjusted),
  )
}

export function getProjectedRaidStartSanity(
  hubSanity: number,
  roomMarks: string[],
): number {
  return applyRaidStartSanity(hubSanity, roomMarks)
}

export function restVesselAfterFailedRaid(character: {
  sanity: number
  corruption: number
}): { sanity: number; corruption: number } {
  return {
    sanity: Math.max(
      HUB_SANITY_REST_MIN,
      Math.floor(character.sanity * 0.5),
    ),
    corruption: Math.max(
      0,
      character.corruption - HUB_CORRUPTION_DECAY_ON_FAIL,
    ),
  }
}
