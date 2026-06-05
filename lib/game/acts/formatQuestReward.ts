import { hubWorkshopUi } from '@/locales/ru/hubWorkshop'
import type { ActQuestReward } from '@/lib/game/acts/types'

export function formatQuestReward(reward: ActQuestReward | undefined): string | null {
  if (!reward) {
    return null
  }

  const parts: string[] = []

  if (reward.echo && reward.echo > 0) {
    parts.push(`+${reward.echo} эхо`)
  }

  if (reward.materials) {
    for (const [id, count] of Object.entries(reward.materials)) {
      if (!count || count <= 0) {
        continue
      }

      const label = hubWorkshopUi.materialLabels[id] ?? id
      parts.push(`${label} ×${count}`)
    }
  }

  if (reward.journalEntries?.length) {
    parts.push('запись в журнале')
  }

  if (reward.flags?.length) {
    parts.push('новая метка')
  }

  return parts.length > 0 ? parts.join(' · ') : null
}
