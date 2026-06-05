import { artifacts } from './artifacts'
import { hubUi, raidSummaryUi, roomMarks, rooms } from './hub'
import { endings } from './endings'
import { origins, originTitles } from './origins'
import { coreScenes, eventScenes, phaseScenes } from './scenes'
import { system } from './system'
import { ui } from './ui'

export const ru = {
  ui,
  system,
  endings,
  artifacts,
  origins,
  originTitles,
  hub: { ui: hubUi, raidSummary: raidSummaryUi, rooms, roomMarks },
  scenes: {
    ...coreScenes,
    ...eventScenes,
    ...phaseScenes,
  },
} as const

export { ui, system, endings, artifacts, origins, originTitles }
export { coreScenes, eventScenes, phaseScenes }
