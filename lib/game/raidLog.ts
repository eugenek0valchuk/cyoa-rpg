import type { HubState, HubRaidLogEntry } from '@/lib/types/hub'
import type { RaidOutcome } from '@/lib/types/raidSummary'

export function appendRaidLog(
  hub: HubState,
  entry: {
    outcome: RaidOutcome
    depth: number
    echoGain?: number
  },
): HubState {
  const logEntry: HubRaidLogEntry = {
    raidNumber: hub.totalRaids,
    outcome: entry.outcome,
    depth: entry.depth,
    echoGain: entry.echoGain,
  }

  return {
    ...hub,
    raidLog: [...(hub.raidLog ?? []), logEntry].slice(-16),
  }
}

export function raidOutcomeLabel(outcome: RaidOutcome): string {
  switch (outcome) {
    case 'extracted':
      return 'Извлечение'
    case 'abandoned':
      return 'Отступление'
    case 'failed':
      return 'Провал'
  }
}
