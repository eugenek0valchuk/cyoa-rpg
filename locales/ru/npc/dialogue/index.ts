import { bellDialogue } from './bell'
import { choirDialogue } from './choir'
import { hereticDialogue } from './heretic'
import { merchantDialogue } from './merchant'
import { synodDialogue } from './synod'
import { waxDialogue } from './wax'
import type { NpcSceneDialoguePack } from './types'

export * from './types'
export * from './resolve'

export const npcSceneDialogue: Record<string, NpcSceneDialoguePack> = {
  ...merchantDialogue,
  ...waxDialogue,
  ...bellDialogue,
  ...choirDialogue,
  ...synodDialogue,
  ...hereticDialogue,
}
