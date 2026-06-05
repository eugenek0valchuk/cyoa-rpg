import { artifacts } from './artifacts'
import { hubUi, raidSummaryUi, roomMarkEffects, roomMarks, rooms } from './hub'
import { hubChronicleUi } from './hubChronicle'
import { endings } from './endings'
import { origins, originTitles } from './origins'
import { raidChronicleUi, raidFlags } from './raidChronicle'
import { journalCatalog, journalUi } from './journal'
import { raidModifierNames, raidUi } from './raid'
import { worldLore } from './lore'
import { loreCardUi, loreCards } from './loreCards'
import { merchantUi, hubMerchantOffers } from './merchant'
import { prologueUi } from './prologue'
import { act1Ui } from './acts/act1Ui'
import { hubWorkshopUi } from './hubWorkshop'
import {
  coreScenes,
  encounterScenes,
  eventScenes,
  originBeatScenes,
  phaseScenes,
} from './scenes'
import { act1Scenes } from './scenes/act1'
import { hubLootScenes } from './scenes/hubLoot'
import { encounterFollowUpScenes } from './scenes/encounterFollowUps'
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
  loreCards: { ui: loreCardUi, catalog: loreCards },
  prologue: { ui: prologueUi },
  merchant: { ui: merchantUi, offers: hubMerchantOffers },
  acts: { act1: act1Ui },
  hubWorkshop: hubWorkshopUi,
  scenes: {
    ...coreScenes,
    ...eventScenes,
    ...phaseScenes,
    ...encounterScenes,
    ...originBeatScenes,
    ...act1Scenes,
    ...hubLootScenes,
    ...repeatFollowUpScenes,
    ...encounterFollowUpScenes,
  },
} as const

export { ui, system, endings, artifacts, origins, originTitles, worldLore }
export { coreScenes, encounterScenes, eventScenes, phaseScenes }
