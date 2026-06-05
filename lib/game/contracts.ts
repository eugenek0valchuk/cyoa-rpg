import {
  contractById,
  contractCatalog,
  type ContractDef,
} from '@/locales/ru/contracts'

import type { HubState, RaidState } from '@/lib/types/hub'
import type { RaidOutcome } from '@/lib/types/raidSummary'

export type ContractEvalContext = {
  outcome: RaidOutcome
  depth: number
  flags: string[]
  sanityAfter: number
  extractSceneId?: string
}

export type ContractResult = {
  contractId: string
  title: string
  fulfilled: boolean
  rewardSummary: string
  claimPending?: boolean
}

export function isScribeUnlocked(hub: HubState): boolean {
  return hub.totalExtractions >= 1
}

function matchesOffer(hub: HubState, contract: ContractDef): boolean {
  const offer = contract.offerWhen

  if (!offer) {
    return true
  }

  if (
    typeof offer.minExtractions === 'number' &&
    hub.totalExtractions < offer.minExtractions
  ) {
    return false
  }

  if (
    typeof offer.maxTotalRaids === 'number' &&
    hub.totalRaids > offer.maxTotalRaids
  ) {
    return false
  }

  if (offer.hasMark && !hub.roomMarks.includes(offer.hasMark)) {
    return false
  }

  if (offer.journal?.length) {
    const hasAny = offer.journal.some((id) =>
      hub.journalEntries.includes(id),
    )

    if (!hasAny) {
      return false
    }
  }

  if (offer.marks?.length) {
    const hasAny = offer.marks.some((id) => hub.roomMarks.includes(id))

    if (!hasAny) {
      return false
    }
  }

  if (offer.missingJournal?.length) {
    const missingAll = offer.missingJournal.every(
      (id) => !hub.journalEntries.includes(id),
    )

    if (!missingAll) {
      return false
    }
  }

  return true
}

export function pickOfferedContracts(hub: HubState, limit = 3): ContractDef[] {
  const eligible = contractCatalog
    .filter((contract) => matchesOffer(hub, contract))
    .sort((left, right) => (right.priority ?? 0) - (left.priority ?? 0))

  const picked: ContractDef[] = []
  const seen = new Set<string>()

  for (const contract of eligible) {
    if (seen.has(contract.id)) {
      continue
    }

    picked.push(contract)
    seen.add(contract.id)

    if (picked.length >= limit) {
      break
    }
  }

  if (picked.length === 0) {
    return [contractById.vow_surface_breath!]
  }

  return picked
}

function checkCondition(
  condition: ContractDef['conditions'][number],
  context: ContractEvalContext,
): boolean {
  switch (condition.kind) {
    case 'extract':
      return (
        context.outcome === 'extracted' ||
        context.outcome === 'emergency_extracted'
      )
    case 'flag':
      return context.flags.includes(String(condition.value))
    case 'min_depth':
      return context.depth >= Number(condition.value)
    case 'min_sanity_end':
      return context.sanityAfter >= Number(condition.value)
    case 'extract_scene':
      return context.extractSceneId === condition.value
    default:
      return false
  }
}

export function evaluateContract(
  contractId: string | null | undefined,
  context: ContractEvalContext,
): boolean {
  if (!contractId) {
    return false
  }

  const contract = contractById[contractId]

  if (!contract) {
    return false
  }

  return contract.conditions.every((condition) =>
    checkCondition(condition, context),
  )
}

export function applyContractRewards(
  hub: HubState,
  contractId: string,
): { hub: HubState; rewardSummary: string } {
  const contract = contractById[contractId]

  if (!contract) {
    return { hub, rewardSummary: '' }
  }

  let nextHub = { ...hub }
  const parts: string[] = []

  for (const reward of contract.rewards) {
    switch (reward.kind) {
      case 'echo': {
        const amount = Number(reward.value ?? 0)
        nextHub = { ...nextHub, echo: (nextHub.echo ?? 0) + amount }
        parts.push(`+${amount} эхо`)
        break
      }
      case 'cleanse_mark': {
        const mark = String(reward.value)
        nextHub = {
          ...nextHub,
          roomMarks: nextHub.roomMarks.filter((entry) => entry !== mark),
        }
        parts.push('след снят')
        break
      }
      case 'next_encounter_boost': {
        nextHub = {
          ...nextHub,
          pendingEncounterBoost: String(reward.value),
        }
        parts.push('путь открыт')
        break
      }
      default:
        break
    }
  }

  return { hub: nextHub, rewardSummary: parts.join(', ') }
}

export function resolveRaidContract(
  hub: HubState,
  raid: RaidState,
  context: ContractEvalContext,
): { hub: HubState; result: ContractResult | null } {
  const contractId = raid.contractId

  if (!contractId) {
    return { hub, result: null }
  }

  const contract = contractById[contractId]

  if (!contract) {
    return { hub, result: null }
  }

  const fulfilled = evaluateContract(contractId, context)

  if (!fulfilled) {
    return {
      hub: { ...hub, pendingContractClaim: null },
      result: {
        contractId,
        title: contract.title,
        fulfilled: false,
        rewardSummary: '',
      },
    }
  }

  return {
    hub: {
      ...hub,
      pendingContractClaim: {
        contractId,
        title: contract.title,
        vow: contract.vow,
        rewardSummary: contract.reward,
      },
    },
    result: {
      contractId,
      title: contract.title,
      fulfilled: true,
      rewardSummary: contract.reward,
      claimPending: true,
    },
  }
}

export function claimPendingContract(hub: HubState): {
  hub: HubState
  rewardSummary: string
} {
  const pending = hub.pendingContractClaim

  if (!pending) {
    return { hub, rewardSummary: '' }
  }

  const rewarded = applyContractRewards(hub, pending.contractId)

  return {
    hub: {
      ...rewarded.hub,
      pendingContractClaim: null,
    },
    rewardSummary: rewarded.rewardSummary || pending.rewardSummary,
  }
}

export function getContractEncounterBoostFlag(
  encounterSceneId: string | null | undefined,
): string | null {
  if (!encounterSceneId) {
    return null
  }

  return `contract_boost_${encounterSceneId}`
}
