import type { Origin } from '@/lib/types/game'

export type HotspotId = 'stash' | 'vessel' | 'chronicle' | 'threshold'

export interface HotspotRegion {
  id: HotspotId
  left: number
  top: number
  width: number
  height: number
}

/** Percent-based click regions over room art — tweak per asset. */
export const roomHotspotLayouts: Record<Origin, HotspotRegion[]> = {
  hollow: [
    { id: 'stash', left: 6, top: 38, width: 24, height: 30 },
    { id: 'vessel', left: 38, top: 28, width: 22, height: 32 },
    { id: 'chronicle', left: 62, top: 18, width: 28, height: 38 },
    { id: 'threshold', left: 28, top: 62, width: 44, height: 28 },
  ],
  heretic: [
    { id: 'stash', left: 8, top: 42, width: 22, height: 28 },
    { id: 'vessel', left: 36, top: 22, width: 26, height: 36 },
    { id: 'chronicle', left: 64, top: 20, width: 26, height: 40 },
    { id: 'threshold', left: 30, top: 64, width: 40, height: 26 },
  ],
  witness: [
    { id: 'stash', left: 10, top: 40, width: 20, height: 30 },
    { id: 'vessel', left: 40, top: 30, width: 22, height: 34 },
    { id: 'chronicle', left: 66, top: 16, width: 24, height: 42 },
    { id: 'threshold', left: 32, top: 60, width: 38, height: 30 },
  ],
}
