'use client'

import { GameIcon } from '@/components/game/ui/GameIcon'
import {
  getHubMerchantOffers,
  purchaseHubMerchantOffer,
  type MerchantOfferView,
} from '@/lib/game/merchant'
import { merchantUi } from '@/locales/ru/merchant'
import type { HubState } from '@/lib/types/hub'

interface HubMerchantPanelProps {
  hub: HubState
  onHubChange: (hub: HubState) => void
  onToast?: (message: string) => void
}

function statusLabel(offer: MerchantOfferView): string {
  switch (offer.status) {
    case 'available':
      return merchantUi.buy
    case 'owned':
      return merchantUi.owned
    case 'purchased':
      return merchantUi.purchased
    case 'unaffordable':
      return merchantUi.notEnoughEcho
    case 'locked':
      return merchantUi.unavailable
  }
}

export function HubMerchantPanel({
  hub,
  onHubChange,
  onToast,
}: HubMerchantPanelProps) {
  const offers = getHubMerchantOffers(hub)

  const handleBuy = (offerId: string) => {
    const result = purchaseHubMerchantOffer(hub, offerId)

    if (!result) {
      return
    }

    onHubChange(result.hub)
    onToast?.(`${merchantUi.purchaseDone}: ${result.message}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border border-[#2b2320] bg-black/30 px-4 py-3">
        <span className="text-[11px] uppercase tracking-[0.12em] text-[#75685f]">
          {merchantUi.echoLabel}
        </span>
        <span className="font-cinzel text-2xl text-[#d8c9be]">{hub.echo ?? 0}</span>
      </div>

      <ul className="space-y-3">
        {offers.map((offer) => {
          const canBuy = offer.status === 'available'

          return (
            <li
              key={offer.id}
              className="border border-[#2b2320] bg-[#0a0808]/80 px-4 py-4"
            >
              <div className="flex items-start gap-3">
                <GameIcon type="artifact" size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-cinzel text-[15px] uppercase tracking-[0.06em] text-[#e7ded7]">
                      {offer.title}
                    </h3>
                    <span className="border border-[#3a3a4a]/60 bg-[#101018] px-2 py-0.5 text-[10px] tabular-nums text-[#a8a8c8]">
                      {offer.cost} {merchantUi.echoLabel.toLowerCase()}
                    </span>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#85776a]">
                    {offer.description}
                  </p>
                  <button
                    type="button"
                    disabled={!canBuy}
                    onClick={() => handleBuy(offer.id)}
                    className="mt-3 border border-[#4a2323] bg-[#160909] px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-[#d46060] transition hover:bg-[#220d0d] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {statusLabel(offer)}
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
