import type { Character } from '@/lib/types/game'

export type RaidModifierId = 'muted_bells' | 'blood_mist' | 'hollow_wind'

export interface RaidModifierDef {
  id: RaidModifierId
  name: string
  description: string
  hint: string
}

export const RAID_MODIFIERS: Record<RaidModifierId, RaidModifierDef> = {
  muted_bells: {
    id: 'muted_bells',
    name: 'Глухие колокола',
    description: 'Колокола монастыря не слышны — разум теряет опору с каждым шагом.',
    hint: '−2 рассудка после каждой сцены',
  },
  blood_mist: {
    id: 'blood_mist',
    name: 'Кровавый туман',
    description: 'Воздух густой и сладкий. Скверна просачивается в дыхание.',
    hint: '+1 скверна после каждой сцены',
  },
  hollow_wind: {
    id: 'hollow_wind',
    name: 'Пустой ветер',
    description: 'Сквозняк вытягивает тепло из костей. Тело помнит падение.',
    hint: '−1 рассудок и +1 скверна после каждой сцены',
  },
}

const MODIFIER_IDS = Object.keys(RAID_MODIFIERS) as RaidModifierId[]

export function pickRaidModifier(seed = Date.now()): RaidModifierId {
  const index = Math.abs(seed) % MODIFIER_IDS.length
  return MODIFIER_IDS[index]!
}

export function getRaidModifier(id: RaidModifierId | null | undefined): RaidModifierDef | null {
  if (!id) {
    return null
  }

  return RAID_MODIFIERS[id] ?? null
}

function clampStat(value: number): number {
  return Math.max(0, Math.min(100, value))
}

export function applyRaidModifierTick(
  character: Character,
  modifierId: RaidModifierId | null | undefined,
): Character {
  if (!modifierId) {
    return character
  }

  switch (modifierId) {
    case 'muted_bells':
      return { ...character, sanity: clampStat(character.sanity - 2) }
    case 'blood_mist':
      return { ...character, corruption: clampStat(character.corruption + 1) }
    case 'hollow_wind':
      return {
        ...character,
        sanity: clampStat(character.sanity - 1),
        corruption: clampStat(character.corruption + 1),
      }
    default:
      return character
  }
}
