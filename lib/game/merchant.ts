import { artifacts } from '@/lib/game/artifacts'
import { mergeJournalEntries } from '@/lib/game/journal'
import { spendEcho } from '@/lib/game/hubMeta'
import {
  getActiveMerchantStockIds,
  syncMerchantStock,
} from '@/lib/game/merchantStock'
import {
  hubMerchantOffers,
  merchantUi,
  type HubMerchantOfferDef,
} from '@/locales/ru/merchant'
import type { HubState } from '@/lib/types/hub'

export { syncMerchantStock } from '@/lib/game/merchantStock'

export type MerchantOfferStatus =
  | 'available'
  | 'owned'
  | 'purchased'
  | 'locked'
  | 'unaffordable'

export type MerchantOfferView = HubMerchantOfferDef & {
  status: MerchantOfferStatus
}

export function isHubMerchantUnlocked(hub: HubState): boolean {
  return (
    hub.totalExtractions >= 1 ||
    (hub.journalEntries ?? []).includes('npc_breathless')
  )
}

export function getBreathlessHubLine(hub: HubState): string {
  if (hub.roomMarks.includes('failure_stain')) {
    return merchantUi.lineStain
  }

  const cycle = hub.raidLog?.length ?? 0
  if (hub.merchantStockCycle === cycle && (hub.merchantPurchases ?? []).length === 0) {
    return merchantUi.lineFreshStock
  }

  if ((hub.merchantPurchases ?? []).length > 0) {
    return merchantUi.lineRepeat
  }

  if ((hub.echo ?? 0) >= 5) {
    return merchantUi.lineRich
  }

  if ((hub.journalEntries ?? []).includes('npc_breathless')) {
    return merchantUi.lineReturn
  }

  return merchantUi.lineDefault
}

function hasArtifactInStash(hub: HubState, artifactId: string): boolean {
  return hub.stash.some((item) => item.id === artifactId)
}

export function getMerchantOfferStatus(
  hub: HubState,
  offer: HubMerchantOfferDef,
): MerchantOfferStatus {
  const purchases = hub.merchantPurchases ?? []

  if (!offer.repeatable && purchases.includes(offer.id)) {
    return 'purchased'
  }

  if (offer.requiresJournal && !(hub.journalEntries ?? []).includes(offer.requiresJournal)) {
    return 'locked'
  }

  if (offer.requiresMark && !hub.roomMarks.includes(offer.requiresMark)) {
    return 'locked'
  }

  if (offer.kind === 'stash_artifact' && offer.artifactId) {
    if (hasArtifactInStash(hub, offer.artifactId)) {
      return 'owned'
    }
  }

  if (offer.kind === 'journal_entry' && offer.journalId) {
    if ((hub.journalEntries ?? []).includes(offer.journalId)) {
      return 'owned'
    }
  }

  if (offer.kind === 'remove_mark' && offer.markId) {
    if (!hub.roomMarks.includes(offer.markId)) {
      return 'owned'
    }
  }

  if ((hub.echo ?? 0) < offer.cost) {
    return 'unaffordable'
  }

  return 'available'
}

export function getHubMerchantOffers(hub: HubState): MerchantOfferView[] {
  const synced = syncMerchantStock(hub)
  const stockIds = new Set(getActiveMerchantStockIds(synced))

  return hubMerchantOffers
    .filter((offer) => stockIds.has(offer.id))
    .map((offer) => ({
      ...offer,
      status: getMerchantOfferStatus(synced, offer),
    }))
}

export function purchaseHubMerchantOffer(
  hub: HubState,
  offerId: string,
): { hub: HubState; message: string } | null {
  const synced = syncMerchantStock(hub)
  const offer = hubMerchantOffers.find((entry) => entry.id === offerId)

  if (!offer) {
    return null
  }

  if (!getActiveMerchantStockIds(synced).includes(offerId)) {
    return null
  }

  if (getMerchantOfferStatus(synced, offer) !== 'available') {
    return null
  }

  const spent = spendEcho(synced, offer.cost)

  if (!spent) {
    return null
  }

  const purchases = spent.merchantPurchases ?? []
  let nextHub: HubState = {
    ...spent,
    merchantPurchases: offer.repeatable
      ? purchases
      : [...purchases, offer.id],
  }

  switch (offer.kind) {
    case 'stash_artifact': {
      const artifact = offer.artifactId ? artifacts[offer.artifactId] : null

      if (!artifact) {
        return null
      }

      nextHub = {
        ...nextHub,
        stash: [...nextHub.stash, { ...artifact }],
      }
      break
    }
    case 'journal_entry': {
      if (!offer.journalId) {
        return null
      }

      nextHub = mergeJournalEntries(nextHub, [offer.journalId])
      break
    }
    case 'remove_mark': {
      if (!offer.markId) {
        return null
      }

      nextHub = {
        ...nextHub,
        roomMarks: nextHub.roomMarks.filter((mark) => mark !== offer.markId),
      }
      break
    }
    case 'sanity_bonus': {
      nextHub = {
        ...nextHub,
        nextRaidSanityBonus:
          (nextHub.nextRaidSanityBonus ?? 0) + (offer.sanityBonus ?? 0),
      }
      break
    }
  }

  return { hub: nextHub, message: offer.title }
}
