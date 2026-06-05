import { artifacts } from '@/lib/game/artifacts'
import { mergeJournalEntries } from '@/lib/game/journal'
import { spendEcho } from '@/lib/game/hubMeta'
import {
  hubMerchantOffers,
  type HubMerchantOfferDef,
} from '@/locales/ru/merchant'
import type { HubState } from '@/lib/types/hub'

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

function hasArtifactInStash(hub: HubState, artifactId: string): boolean {
  return hub.stash.some((item) => item.id === artifactId)
}

export function getMerchantOfferStatus(
  hub: HubState,
  offer: HubMerchantOfferDef,
): MerchantOfferStatus {
  const purchases = hub.merchantPurchases ?? []

  if (offer.once && purchases.includes(offer.id)) {
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
  return hubMerchantOffers.map((offer) => ({
    ...offer,
    status: getMerchantOfferStatus(hub, offer),
  }))
}

export function purchaseHubMerchantOffer(
  hub: HubState,
  offerId: string,
): { hub: HubState; message: string } | null {
  const offer = hubMerchantOffers.find((entry) => entry.id === offerId)

  if (!offer) {
    return null
  }

  if (getMerchantOfferStatus(hub, offer) !== 'available') {
    return null
  }

  const spent = spendEcho(hub, offer.cost)

  if (!spent) {
    return null
  }

  let nextHub: HubState = {
    ...spent,
    merchantPurchases: [...(spent.merchantPurchases ?? []), offer.id],
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
