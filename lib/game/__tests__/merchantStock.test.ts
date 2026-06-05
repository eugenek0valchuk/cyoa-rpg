import { describe, expect, it } from 'vitest'

import { createInitialHubState } from '@/lib/types/hub'

import {
  MERCHANT_STOCK_SIZE,
  pickMerchantStockIds,
  syncMerchantStock,
} from '../merchantStock'
import { getHubMerchantOffers, purchaseHubMerchantOffer } from '../merchant'

describe('merchant stock rotation', () => {
  const unlockedHub = {
    ...createInitialHubState(),
    echo: 20,
    journalEntries: ['npc_breathless'],
    totalExtractions: 1,
    raidLog: [{ raidNumber: 1, outcome: 'extracted' as const, depth: 3 }],
  }

  it('picks a limited stock size from eligible offers', () => {
    const ids = pickMerchantStockIds(unlockedHub, 1)

    expect(ids.length).toBeGreaterThan(0)
    expect(ids.length).toBeLessThanOrEqual(MERCHANT_STOCK_SIZE)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('refreshes stock and clears purchases after a new raid log entry', () => {
    const first = syncMerchantStock({
      ...unlockedHub,
      merchantPurchases: ['offer_candle'],
      merchantStockCycle: 0,
      merchantStockIds: ['offer_candle'],
    })

    const second = syncMerchantStock({
      ...first,
      raidLog: [
        ...(first.raidLog ?? []),
        { raidNumber: 2, outcome: 'failed', depth: 2 },
      ],
    })

    expect(second.merchantStockCycle).toBe(2)
    expect(second.merchantPurchases).toEqual([])
    expect(second.merchantStockIds?.length).toBeGreaterThan(0)
  })

  it('shows only active stock offers', () => {
    const hub = syncMerchantStock(unlockedHub)
    const offers = getHubMerchantOffers(hub)

    expect(offers.length).toBe(hub.merchantStockIds?.length)
    expect(offers.every((offer) => hub.merchantStockIds?.includes(offer.id))).toBe(
      true,
    )
  })

  it('allows buying repeatable sanity balm multiple times', () => {
    let hub = syncMerchantStock({
      ...unlockedHub,
      merchantStockIds: ['offer_sanity_balm'],
      merchantStockCycle: 1,
    })

    const first = purchaseHubMerchantOffer(hub, 'offer_sanity_balm')
    expect(first?.hub.nextRaidSanityBonus).toBe(5)
    expect(first?.hub.merchantPurchases ?? []).not.toContain('offer_sanity_balm')

    hub = first!.hub
    const second = purchaseHubMerchantOffer(hub, 'offer_sanity_balm')
    expect(second?.hub.nextRaidSanityBonus).toBe(10)
  })
})
