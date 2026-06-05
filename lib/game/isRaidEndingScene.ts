import { t } from '@/lib/i18n'

import type { Scene } from '../types/game'

const ENDING_SCENE_IDS = new Set(Object.keys(t.endings))

export function isRaidEndingScene(scene: Scene | null | undefined): boolean {
  if (!scene) {
    return false
  }

  if (scene.options.length === 0) {
    return true
  }

  return ENDING_SCENE_IDS.has(scene.id)
}
