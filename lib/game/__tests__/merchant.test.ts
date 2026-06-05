import { describe, expect, it } from 'vitest'

import { createInitialHubState } from '@/lib/types/hub'

import {
  getBreathlessHubLine,
  getHubMerchantOffers,
  isHubMerchantUnlocked,
  purchaseHubMerchantOffer,
} from '../merchant'
import { merchantUi } from '@/locales/ru/merchant'

describe('hub merchant', () => {
  it('unlocks after breathless journal or extraction', () => {
    expect(isHubMerchantUnlocked(createInitialHubState())).toBe(false)
    expect(
      isHubMerchantUnlocked({
        ...createInitialHubState(),
        journalEntries: ['npc_breathless'],
      }),
    ).toBe(true)
    expect(
      isHubMerchantUnlocked({
        ...createInitialHubState(),
        totalExtractions: 1,
      }),
    ).toBe(true)
  })

  it('buys candle into stash', () => {
    const hub = {
      ...createInitialHubState(),
      echo: 5,
      journalEntries: ['npc_breathless'],
    }

    const result = purchaseHubMerchantOffer(hub, 'offer_candle')

    expect(result?.hub.echo).toBe(2)
    expect(result?.hub.stash.some((item) => item.id === 'buried_choir_candle')).toBe(
      true,
    )
  })

  it('marks synod rumor owned when journal already has entry', () => {
    const hub = {
      ...createInitialHubState(),
      echo: 5,
      journalEntries: ['npc_breathless', 'npc_synod'],
    }

    const offers = getHubMerchantOffers(hub)
    const rumor = offers.find((offer) => offer.id === 'offer_synod_rumor')

    expect(rumor?.status).toBe('owned')
  })

  it('applies sanity bonus for next raid', () => {
    const hub = {
      ...createInitialHubState(),
      echo: 5,
      journalEntries: ['npc_breathless'],
    }

    const result = purchaseHubMerchantOffer(hub, 'offer_sanity_balm')

    expect(result?.hub.nextRaidSanityBonus).toBe(5)
    expect(result?.hub.merchantPurchases).toContain('offer_sanity_balm')
  })

  it('picks breathless dialogue by hub state', () => {
    expect(getBreathlessHubLine(createInitialHubState())).toBe(
      merchantUi.lineDefault,
    )
    expect(
      getBreathlessHubLine({
        ...createInitialHubState(),
        journalEntries: ['npc_breathless'],
      }),
    ).toBe(merchantUi.lineReturn)
    expect(
      getBreathlessHubLine({
        ...createInitialHubState(),
        roomMarks: ['failure_stain'],
      }),
    ).toBe(merchantUi.lineStain)
  })
})
