import type { StoryPhase } from './director'

export const choicePools: Record<string, string[]> = {
  mouth: [
    'encounter_wax_pilgrim',
    'mouth',
    'descent_echoes',
    'descent_reliquary',
  ],
  monastery: [
    'encounter_bell_wretch',
    'monastery',
    'whispers_parlor',
    'whispers_mirror',
  ],
  merchant: [
    'encounter_synod_acolyte',
    'merchant',
    'descent_reliquary',
  ],
  descent: [
    'encounter_wax_pilgrim',
    'descent',
    'fracture_stairs',
    'iron_passage',
  ],
  bell: ['encounter_bell_wretch', 'bell', 'fracture_choir', 'whispers_parlor'],
  catacombs: [
    'encounter_choir_remnant',
    'catacombs',
    'whispers_mirror',
    'read_writings',
  ],
}

export const phasePools: Record<StoryPhase, string[]> = {
  DESCENT: ['descent_echoes', 'descent_reliquary', 'encounter_wax_pilgrim'],
  WHISPERS: ['whispers_parlor', 'whispers_mirror', 'encounter_synod_acolyte'],
  FRACTURE: ['fracture_stairs', 'fracture_choir', 'encounter_choir_remnant'],
  COMMUNION: ['communion_vein', 'communion_throne'],
  COLLAPSE: ['collapse_threshold', 'collapse_maw'],
}
