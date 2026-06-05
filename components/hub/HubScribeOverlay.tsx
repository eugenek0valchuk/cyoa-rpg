'use client'

import { createPortal } from 'react-dom'
import { useEffect } from 'react'
import { X } from 'lucide-react'
import Image from 'next/image'

import { GameIcon } from '@/components/game/ui/GameIcon'
import { getScribeHubLine } from '@/lib/game/contracts'
import type { ContractDef } from '@/locales/ru/contracts'
import { scribeUi } from '@/locales/ru/contracts'
import { zLayers } from '@/lib/ui/layers'
import type { HubState } from '@/lib/types/hub'

import { HubContractClaim } from './HubContractClaim'
import { HubScribePanel } from './HubScribePanel'

interface HubScribeOverlayProps {
  open: boolean
  unlocked: boolean
  hub: HubState
  offered: ContractDef[]
  selectedContractId: string | null
  selectedContractTitle?: string
  onSelectContract: (contractId: string | null) => void
  onClose: () => void
  claimToast: string | null
  claimingContract: boolean
  onClaimContract: () => void
}

function renderEmphasis(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-medium text-[#e7ded7]">
        {part}
      </strong>
    ) : (
      part
    ),
  )
}

export function HubScribeOverlay({
  open,
  unlocked,
  hub,
  offered,
  selectedContractId,
  selectedContractTitle,
  onSelectContract,
  onClose,
  claimToast,
  claimingContract,
  onClaimContract,
}: HubScribeOverlayProps) {
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

  const line = unlocked ? getScribeHubLine(hub) : scribeUi.lockedBody

  return createPortal(
    <div
      data-testid="scribe-overlay"
      className={`fixed inset-0 ${zLayers.hubMerchant} flex items-center justify-center p-3 sm:p-6`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="scribe-overlay-title"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/82 backdrop-blur-[3px]"
        onClick={onClose}
      />

      <div className="relative z-10 flex h-[min(92vh,760px)] w-full max-w-7xl flex-col overflow-hidden border-2 border-[#4a3030] bg-[#0a0707] shadow-[0_0_80px_rgba(92,31,31,0.35)] lg:flex-row">
        <div className="relative flex min-h-[min(40vh,340px)] w-full shrink-0 items-end justify-center overflow-hidden bg-[#080606] lg:min-h-0 lg:min-w-0 lg:flex-1">
          <Image
            src="/hub/scribe-chamber-scene.png"
            alt=""
            fill
            className="object-cover object-[center_88%]"
            sizes="(max-width: 1024px) 100vw, 70vw"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0707] via-[#0a0707]/20 to-black/50" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-[#0a0707]/90 to-transparent lg:block" />

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <div className="flex items-end gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-[#6a5020]/80 bg-[#120e08]/90 shadow-[0_0_24px_rgba(106,80,32,0.2)] sm:h-20 sm:w-20">
                <GameIcon type="intelligence" size={36} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#a08040]">
                  {scribeUi.npcTitle}
                </p>
                <h2
                  id="scribe-overlay-title"
                  className="font-cinzel text-xl uppercase tracking-[0.08em] text-[#efe5dc] sm:text-2xl"
                >
                  {scribeUi.npcName}
                </h2>
              </div>
            </div>
            <blockquote className="mt-4 border-l-2 border-[#8e1f1f]/70 pl-4 text-[14px] leading-relaxed text-[#cfc2b8] sm:text-[15px]">
              «{renderEmphasis(line)}»
            </blockquote>
          </div>
        </div>

        <div className="flex min-h-0 w-full shrink-0 flex-col border-t border-[#2b2320] lg:w-[21rem] lg:border-l lg:border-t-0 xl:w-[23rem]">
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#241919] bg-[#120d0d] px-4 py-3 sm:px-5">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#75685f]">
                {unlocked ? scribeUi.subtitle : scribeUi.lockedTitle}
              </p>
              <p className="mt-1 font-cinzel text-lg uppercase tracking-[0.06em] text-[#e7ded7]">
                {unlocked ? scribeUi.contractsTitle : scribeUi.title}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 border border-[#2b2320] p-2 text-[#75685f] transition hover:border-[#5c1f1f] hover:text-[#d46060]"
              aria-label={scribeUi.close}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto chronicle-scrollbar px-4 py-4 sm:px-5">
            {claimToast && (
              <p className="mb-4 border border-[#2a3d2a] bg-[#0a120a]/80 px-4 py-3 text-[13px] text-[#8fbc8f]">
                {claimToast}
              </p>
            )}

            {unlocked ? (
              <>
                {hub.pendingContractClaim && (
                  <HubContractClaim
                    claim={hub.pendingContractClaim}
                    onClaim={onClaimContract}
                    claiming={claimingContract}
                  />
                )}
                <HubScribePanel
                  hub={hub}
                  offered={offered}
                  selectedContractId={selectedContractId}
                  onSelect={onSelectContract}
                  hideGreeting
                />
              </>
            ) : (
              <p className="text-[14px] leading-relaxed text-[#85776a]">
                {scribeUi.lockedBody}
              </p>
            )}
          </div>

          {unlocked && selectedContractTitle && (
            <div className="shrink-0 border-t border-[#241919] bg-[#0a0707] px-4 py-3 sm:px-5">
              <p className="text-[13px] text-[#6a8f6a]">
                {scribeUi.activeContract}: {selectedContractTitle}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
