import type { StoryPhase } from './director'

export const choicePools: Record<string, string[]> = {
  mouth: ['mouth', 'descent_echoes', 'descent_reliquary'],
  monastery: ['monastery', 'whispers_parlor', 'whispers_mirror'],
  merchant: ['merchant', 'descent_reliquary'],
  descent: ['descent', 'fracture_stairs'],
  bell: ['bell', 'fracture_choir'],
  catacombs: ['catacombs', 'whispers_mirror'],
}

export const phasePools: Record<StoryPhase, string[]> = {
  DESCENT: ['descent_echoes', 'descent_reliquary'],
  WHISPERS: ['whispers_parlor', 'whispers_mirror'],
  FRACTURE: ['fracture_stairs', 'fracture_choir'],
  COMMUNION: ['communion_vein', 'communion_throne'],
  COLLAPSE: ['collapse_threshold', 'collapse_maw'],
}
