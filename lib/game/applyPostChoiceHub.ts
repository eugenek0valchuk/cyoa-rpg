import { act1EventsToToasts } from '@/lib/game/acts/questNotifications'
import { evaluateAct1ProgressWithEvents } from '@/lib/game/acts/questEngine'
import { addFolioFragment, addHubMaterials } from '@/lib/game/hubWorkshop'
import { hubWorkshopUi } from '@/locales/ru/hubWorkshop'
import type { HubToastItem } from '@/components/ui/HubToast'
import type { Character, Choice } from '@/lib/types/game'
import type { HubState } from '@/lib/types/hub'

export function applyPostChoiceHubUpdates(
  hub: HubState,
  character: Character,
  choice: Choice,
  sceneIds: string[],
): { hub: HubState; character: Character; toasts: HubToastItem[] } {
  let nextHub = hub
  const toasts: HubToastItem[] = []

  if (choice.effects?.addMaterials) {
    const gains = { ...choice.effects.addMaterials }
    const folioCount = gains.folio_page ?? 0

    if (folioCount > 0) {
      delete gains.folio_page

      for (let i = 0; i < folioCount; i += 1) {
        const added = addFolioFragment(nextHub)
        nextHub = added.hub

        if (added.fragmentId) {
          const text =
            hubWorkshopUi.folioFragments[added.fragmentId] ?? added.fragmentId
          toasts.push({
            id: `folio-${added.fragmentId}-${Date.now()}`,
            title: `${hubWorkshopUi.folioFragmentTitle} · ${hubWorkshopUi.materialLabels.folio_page}`,
            body: text,
            tone: 'material',
          })
        }
      }
    }

    if (Object.keys(gains).length > 0) {
      nextHub = addHubMaterials(nextHub, gains)

      for (const [materialId, count] of Object.entries(gains)) {
        if (!count || count <= 0) {
          continue
        }

        const label = hubWorkshopUi.materialLabels[materialId] ?? materialId
        toasts.push({
          id: `material-${materialId}-${Date.now()}-${Math.random()}`,
          title: hubWorkshopUi.toastMaterial,
          body: `${label} лёг на полку камеры.`,
          tone: 'material',
        })
      }
    }
  }

  const evaluation = evaluateAct1ProgressWithEvents(
    nextHub,
    character,
    sceneIds,
  )

  return {
    hub: evaluation.hub,
    character: evaluation.character,
    toasts: [...toasts, ...act1EventsToToasts(evaluation.events)],
  }
}
