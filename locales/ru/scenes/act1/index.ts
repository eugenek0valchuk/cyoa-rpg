export { act1WitnessScenes } from './witness'
export { act1HereticScenes } from './heretic'
export { act1HollowScenes } from './hollow'
export { act1OptionalScenes } from './optional'
export { act1EncounterScenes } from './encounters'
export { act1SidequestScenes } from './sidequests'

import { act1EncounterScenes } from './encounters'
import { act1SidequestScenes } from './sidequests'
import { act1HereticScenes } from './heretic'
import { act1HollowScenes } from './hollow'
import { act1OptionalScenes } from './optional'
import { act1WitnessScenes } from './witness'

export const act1Scenes = {
  ...act1WitnessScenes,
  ...act1HereticScenes,
  ...act1HollowScenes,
  ...act1OptionalScenes,
  ...act1SidequestScenes,
  ...act1EncounterScenes,
}

export const ACT1_SCENE_IDS = Object.keys(act1Scenes)
