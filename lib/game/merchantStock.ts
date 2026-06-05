import {
  hubMerchantOffers,
  type HubMerchantOfferDef,
} from '@/locales/ru/merchant'
import { isHubMerchantUnlocked } from '@/lib/game/merchant'
import type { HubState } from '@/lib/types/hub'

export const MERCHANT_STOCK_SIZE = 4

function hasArtifactInStash(hub: HubState, artifactId: string): boolean {
  return hub.stash.some((item) => item.id === artifactId)
}

/** Можно ли выставить оффер в текущую витрину */
export function isOfferEligibleForStock(
  hub: HubState,
  offer: HubMerchantOfferDef,
): boolean {
  if (
    offer.requiresJournal &&
    !(hub.journalEntries ?? []).includes(offer.requiresJournal)
  ) {
    return false
  }

  if (offer.requiresMark && !hub.roomMarks.includes(offer.requiresMark)) {
    return false
  }

  if (offer.kind === 'journal_entry' && offer.journalId) {
    if ((hub.journalEntries ?? []).includes(offer.journalId)) {
      return false
    }
  }

  if (offer.kind === 'stash_artifact' && offer.artifactId) {
    if (hasArtifactInStash(hub, offer.artifactId)) {
      return false
    }
  }

  if (offer.kind === 'remove_mark' && offer.markId) {
    if (!hub.roomMarks.includes(offer.markId)) {
      return false
    }
  }

  return true
}

function stockSeed(cycle: number, hub: HubState): number {
  return (
    cycle * 7919 +
    hub.totalExtractions * 31 +
    hub.bestDepth * 17 +
    (hub.echo ?? 0)
  )
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const list = [...items]
  let state = seed >>> 0

  for (let index = list.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0
    const swap = state % (index + 1)
    ;[list[index], list[swap]] = [list[swap]!, list[index]!]
  }

  return list
}

export function pickMerchantStockIds(hub: HubState, cycle: number): string[] {
  const eligible = hubMerchantOffers.filter((offer) =>
    isOfferEligibleForStock(hub, offer),
  )

  const repeatables = eligible.filter((offer) => offer.repeatable)
  const regular = eligible.filter((offer) => !offer.repeatable)
  const shuffled = seededShuffle(regular, stockSeed(cycle, hub))

  const picked: string[] = []
  const seen = new Set<string>()

  for (const offer of shuffled) {
    if (picked.length >= MERCHANT_STOCK_SIZE) {
      break
    }

    if (seen.has(offer.id)) {
      continue
    }

    picked.push(offer.id)
    seen.add(offer.id)
  }

  for (const offer of repeatables) {
    if (picked.length >= MERCHANT_STOCK_SIZE) {
      break
    }

    if (seen.has(offer.id)) {
      continue
    }

    picked.push(offer.id)
    seen.add(offer.id)
  }

  if (picked.length < MERCHANT_STOCK_SIZE) {
    for (const offer of hubMerchantOffers) {
      if (picked.length >= MERCHANT_STOCK_SIZE) {
        break
      }

      if (!offer.repeatable || seen.has(offer.id)) {
        continue
      }

      picked.push(offer.id)
      seen.add(offer.id)
    }
  }

  return picked
}

/** Обновить витрину после возвращения из спуска */
export function syncMerchantStock(hub: HubState): HubState {
  if (!isHubMerchantUnlocked(hub)) {
    return hub
  }

  const cycle = hub.raidLog?.length ?? 0

  if (
    hub.merchantStockCycle === cycle &&
    (hub.merchantStockIds?.length ?? 0) > 0
  ) {
    return hub
  }

  const merchantStockIds = pickMerchantStockIds(hub, cycle)

  return {
    ...hub,
    merchantStockCycle: cycle,
    merchantStockIds,
    merchantPurchases: [],
  }
}

export function getActiveMerchantStockIds(hub: HubState): string[] {
  if (hub.merchantStockIds?.length) {
    return hub.merchantStockIds
  }

  return hubMerchantOffers.map((offer) => offer.id)
}
