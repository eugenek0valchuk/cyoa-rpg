import { artifacts } from './artifacts'
import { hubUi, raidSummaryUi, roomMarkEffects, roomMarks, rooms } from './hub'
import { hubChronicleUi } from './hubChronicle'
import { endings } from './endings'
import { origins, originTitles } from './origins'
import { raidChronicleUi, raidFlags } from './raidChronicle'
import { journalCatalog, journalUi } from './journal'
import { raidModifierNames, raidUi } from './raid'
import { worldLore } from './lore'
import {
  coreScenes,
  encounterScenes,
  eventScenes,
  originBeatScenes,
  phaseScenes,
} from './scenes'
import { repeatFollowUpScenes } from './scenes/repeatVariants'
import { system } from './system'
import { ui } from './ui'

export const ru = {
  ui,
  system,
  endings,
  artifacts,
  origins,
  originTitles,
  raid: { ui: raidUi, modifierNames: raidModifierNames },
  raidChronicle: { ui: raidChronicleUi, flags: raidFlags },
  journal: { ui: journalUi, catalog: journalCatalog },
  hub: { ui: hubUi, chronicle: hubChronicleUi, raidSummary: raidSummaryUi, rooms, roomMarks, roomMarkEffects },
  lore: worldLore,
  scenes: {
    ...coreScenes,
    ...eventScenes,
    ...phaseScenes,
    ...encounterScenes,
    ...originBeatScenes,
    ...repeatFollowUpScenes,
  },
} as const

export { ui, system, endings, artifacts, origins, originTitles, worldLore }
export { coreScenes, encounterScenes, eventScenes, phaseScenes }
