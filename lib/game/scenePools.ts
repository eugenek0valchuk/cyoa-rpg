import type { StoryPhase } from './director'

export const choicePools: Record<string, string[]> = {
  mouth: ['mouth', 'descent_echoes', 'descent_reliquary', 'encounter_wax_pilgrim'],
  monastery: ['monastery', 'whispers_parlor', 'whispers_mirror', 'encounter_bell_wretch'],
  merchant: ['merchant', 'descent_reliquary', 'encounter_synod_acolyte'],
  descent: ['descent', 'fracture_stairs', 'encounter_wax_pilgrim'],
  bell: ['bell', 'fracture_choir', 'encounter_bell_wretch'],
  catacombs: ['catacombs', 'whispers_mirror', 'encounter_choir_remnant'],
}

export const phasePools: Record<StoryPhase, string[]> = {
  DESCENT: ['descent_echoes', 'descent_reliquary', 'encounter_wax_pilgrim'],
  WHISPERS: ['whispers_parlor', 'whispers_mirror', 'encounter_synod_acolyte'],
  FRACTURE: ['fracture_stairs', 'fracture_choir', 'encounter_choir_remnant'],
  COMMUNION: ['communion_vein', 'communion_throne'],
  COLLAPSE: ['collapse_threshold', 'collapse_maw'],
}
