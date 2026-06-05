'use client'

import { createPortal } from 'react-dom'
import { useEffect } from 'react'
import { X } from 'lucide-react'
import Image from 'next/image'

import { GameIcon } from '@/components/game/ui/GameIcon'
import { getBreathlessHubLine } from '@/lib/game/merchant'
import { merchantUi } from '@/locales/ru/merchant'
import { zLayers } from '@/lib/ui/layers'
import type { HubState } from '@/lib/types/hub'

import { HubMerchantPanel } from './HubMerchantPanel'

interface HubMerchantOverlayProps {
  open: boolean
  unlocked: boolean
  hub: HubState
  onClose: () => void
  onHubChange: (hub: HubState) => void
  toast: string | null
  onToast: (message: string) => void
}

export function HubMerchantOverlay({
  open,
  unlocked,
  hub,
  onClose,
  onHubChange,
  toast,
  onToast,
}: HubMerchantOverlayProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') {
    return null
  }

  const line = unlocked
    ? getBreathlessHubLine(hub)
    : merchantUi.lockedBody

  return createPortal(
    <div
      className={`fixed inset-0 ${zLayers.hubMerchant} flex items-center justify-center p-3 sm:p-6`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="merchant-overlay-title"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/82 backdrop-blur-[3px]"
        onClick={onClose}
      />

      <div className="relative z-10 flex h-[min(92vh,780px)] w-full max-w-6xl flex-col overflow-hidden border-2 border-[#4a3030] bg-[#0a0707] shadow-[0_0_80px_rgba(92,31,31,0.35)] lg:max-w-7xl lg:flex-row">
        <div className="relative min-h-[220px] w-full shrink-0 lg:min-h-0 lg:w-[44%]">
          <Image
            src="/hub/merchant-cart-scene.png"
            alt=""
            fill
            className="object-cover object-left"
            sizes="(max-width: 1024px) 100vw, 44vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/50 to-[#0a0707] lg:to-[#0a0707]/95" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0707] via-transparent to-black/40" />

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <div className="flex items-end gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-[#6a5020]/80 bg-[#120e08]/90 shadow-[0_0_24px_rgba(106,80,32,0.2)] sm:h-20 sm:w-20">
                <GameIcon type="merchant" size={36} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#a08040]">
                  {merchantUi.npcTitle}
                </p>
                <h2
                  id="merchant-overlay-title"
                  className="font-cinzel text-xl uppercase tracking-[0.08em] text-[#efe5dc] sm:text-2xl"
                >
                  {merchantUi.npcName}
                </h2>
              </div>
            </div>
            <blockquote className="mt-4 border-l-2 border-[#8e1f1f]/70 pl-4 text-[14px] leading-relaxed text-[#cfc2b8] sm:text-[15px]">
              «{line}»
            </blockquote>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col border-t border-[#2b2320] lg:border-l lg:border-t-0">
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#241919] bg-[#120d0d] px-4 py-3 sm:px-5">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#75685f]">
                {unlocked ? merchantUi.subtitle : merchantUi.lockedTitle}
              </p>
              <p className="mt-1 font-cinzel text-lg uppercase tracking-[0.06em] text-[#e7ded7]">
                {merchantUi.shopTitle}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 border border-[#2b2320] p-2 text-[#75685f] transition hover:border-[#5c1f1f] hover:text-[#d46060]"
              aria-label={merchantUi.close}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto chronicle-scrollbar px-4 py-4 sm:px-5">
            {toast && (
              <p className="mb-4 border border-[#2a3d2a] bg-[#0a120a]/80 px-4 py-3 text-[13px] text-[#8fbc8f]">
                {toast}
              </p>
            )}

            {unlocked ? (
              <HubMerchantPanel
                hub={hub}
                onHubChange={onHubChange}
                onToast={onToast}
                variant="shop"
              />
            ) : (
              <p className="text-[14px] leading-relaxed text-[#85776a]">
                {merchantUi.lockedBody}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
