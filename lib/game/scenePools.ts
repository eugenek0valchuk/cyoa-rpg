import { ACT1_SCENE_IDS } from '@/locales/ru/scenes/act1'

import type { StoryPhase } from './director'

function withAct1Scenes(pool: string[], loot: string[] = []): string[] {
  return [...pool, ...ACT1_SCENE_IDS, ...loot]
}

export const choicePools: Record<string, string[]> = {
  mouth: withAct1Scenes([
    'encounter_wax_pilgrim',
    'encounter_chamber_keeper',
    'mouth',
    'descent_echoes',
    'descent_reliquary',
  ]),
  monastery: withAct1Scenes(
    [
      'encounter_bell_wretch',
      'encounter_void_elder',
      'encounter_chamber_keeper',
      'monastery',
      'whispers_parlor',
      'whispers_mirror',
    ],
    ['loot_folio_shelf'],
  ),
  merchant: withAct1Scenes(
    ['encounter_synod_acolyte', 'merchant', 'descent_reliquary'],
    ['loot_wax_bundle'],
  ),
  descent: withAct1Scenes(
    [
      'encounter_wax_pilgrim',
      'descent',
      'fracture_stairs',
      'iron_passage',
    ],
    ['loot_iron_cache'],
  ),
  bell: withAct1Scenes(
    ['encounter_bell_wretch', 'bell', 'fracture_choir', 'whispers_parlor'],
    ['loot_choir_splinter'],
  ),
  catacombs: withAct1Scenes(
    [
      'encounter_choir_remnant',
      'catacombs',
      'whispers_mirror',
      'read_writings',
    ],
    ['loot_folio_shelf'],
  ),
  read_writings: withAct1Scenes(['read_writings', 'catacombs']),
  jump_pit: withAct1Scenes(['mouth', 'descent']),
}

export const phasePools: Record<StoryPhase, string[]> = {
  DESCENT: ['descent_echoes', 'descent_reliquary', 'encounter_wax_pilgrim'],
  WHISPERS: ['whispers_parlor', 'whispers_mirror', 'encounter_synod_acolyte'],
  FRACTURE: ['fracture_stairs', 'fracture_choir', 'encounter_choir_remnant'],
  COMMUNION: ['communion_vein', 'communion_throne'],
  COLLAPSE: ['collapse_threshold', 'collapse_maw'],
}
