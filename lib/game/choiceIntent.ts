import { ZONE_BRIDGE_CONTINUE_ID } from './zoneTransitions'

import type { Choice } from '@/lib/types/game'

export type ChoiceIntent =
  | 'deeper'
  | 'retreat'
  | 'risk'
  | 'lore'
  | 'rest'
  | 'neutral'

const DEEPER_ROUTE_IDS = new Set([
  'catacombs',
  'jump_pit',
  'pit_lip',
  'submerged_crypt',
  'iron_passage',
  'descent',
  'mouth',
  'bell',
  'monastery',
  'merchant',
  'encounter_synod_acolyte',
  'encounter_wax_pilgrim',
  'encounter_choir_remnant',
  'encounter_bell_wretch',
  'take_mask',
  'warm_darkness',
  'flooded_depths',
])

const RETREAT_ROUTE_IDS = new Set([
  'exit_monastery',
  'catacombs_retreat',
  'leave_cart',
  'start',
  'candle_afterglow',
])

const RETREAT_CHOICE_IDS = new Set([
  'exit_monastery',
  'catacombs_retreat',
  'leave_cart',
])

const DEEPER_CHOICE_IDS = new Set([ZONE_BRIDGE_CONTINUE_ID])

const LORE_ROUTE_IDS = new Set([
  'read_writings',
  'pit_listen',
  'merchant',
  'encounter_synod_acolyte',
  'beat_heretic_whisper',
  'beat_witness_bell',
])

function routeId(choice: Choice): string {
  return choice.targetSceneId ?? choice.id
}

export function inferChoiceIntent(choice: Choice): ChoiceIntent {
  const route = routeId(choice)
  const sanity = choice.effects?.sanity ?? 0
  const corruption = choice.effects?.corruption ?? 0

  if (
    RETREAT_CHOICE_IDS.has(choice.id) ||
    (RETREAT_ROUTE_IDS.has(route) && sanity >= 0 && corruption <= 2)
  ) {
    return 'retreat'
  }

  if (corruption >= 4 || sanity <= -5) {
    return 'risk'
  }

  if (LORE_ROUTE_IDS.has(route) || choice.id.startsWith('read_')) {
    return 'lore'
  }

  if (sanity > 0 && corruption <= 0) {
    return 'rest'
  }

  if (
    DEEPER_CHOICE_IDS.has(choice.id) ||
    DEEPER_ROUTE_IDS.has(route) ||
    choice.id.includes('descent')
  ) {
    return 'deeper'
  }

  return 'neutral'
}
