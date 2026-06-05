export { act1WitnessScenes } from './witness'
export { act1HereticScenes } from './heretic'
export { act1HollowScenes } from './hollow'

import { act1HereticScenes } from './heretic'
import { act1HollowScenes } from './hollow'
import { act1WitnessScenes } from './witness'

export const act1Scenes = {
  ...act1WitnessScenes,
  ...act1HereticScenes,
  ...act1HollowScenes,
}

export const ACT1_SCENE_IDS = Object.keys(act1Scenes)
