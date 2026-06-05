import { mergeJournalEntries } from '@/lib/game/journal'
import { addFolioFragment, addHubMaterials } from '@/lib/game/hubWorkshop'
import type { ActQuestReward } from '@/lib/game/acts/types'
import type { Character } from '@/lib/types/game'
import type { HubState } from '@/lib/types/hub'

export function applyActQuestReward(
  hub: HubState,
  character: Character,
  reward: ActQuestReward | undefined,
): { hub: HubState; character: Character } {
  if (!reward) {
    return { hub, character }
  }

  let nextHub = hub
  let nextCharacter = character

  if (reward.materials) {
    const gains = { ...reward.materials }
    const folioCount = gains.folio_page ?? 0

    if (folioCount > 0) {
      delete gains.folio_page
      for (let i = 0; i < folioCount; i += 1) {
        nextHub = addFolioFragment(nextHub).hub
      }
    }

    if (Object.keys(gains).length > 0) {
      nextHub = addHubMaterials(nextHub, gains)
    }
  }

  if (reward.echo && reward.echo > 0) {
    nextHub = {
      ...nextHub,
      echo: (nextHub.echo ?? 0) + reward.echo,
    }
  }

  if (reward.journalEntries?.length) {
    nextHub = mergeJournalEntries(nextHub, reward.journalEntries)
  }

  if (reward.flags?.length) {
    const flags = new Set(nextCharacter.flags ?? [])
    for (const flag of reward.flags) {
      flags.add(flag)
    }
    nextCharacter = { ...nextCharacter, flags: [...flags] }
  }

  return { hub: nextHub, character: nextCharacter }
}
