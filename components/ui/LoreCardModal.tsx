'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'

import type { LoreCardDef } from '@/locales/ru/loreCards'
import { zLayers } from '@/lib/ui/layers'
import { loreCardUi } from '@/locales/ru/loreCards'

interface LoreCardModalProps {
  open: boolean
  card: LoreCardDef | null
  onClose: () => void
}

function renderEmphasis(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-medium text-[#e7ded7]">
        {part}
      </strong>
    ) : (
      <span key={index}>{part}</span>
    ),
  )
}

export function LoreCardModal({ open, card, onClose }: LoreCardModalProps) {
  if (!card) {
    return null
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={`fixed inset-0 ${zLayers.loreCard} flex items-end justify-center bg-black/82 px-4 pb-6 sm:items-center sm:pb-0`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.article
            role="dialog"
            aria-labelledby="lore-card-title"
            className="w-full max-w-lg overflow-hidden border border-[#6a5020]/70 bg-[#0d0909] shadow-[0_0_48px_rgba(106,80,32,0.18)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onClick={(event) => event.stopPropagation()}
          >
            {card.imageSrc && (
              <div className="relative h-40 w-full border-b border-[#241919] bg-[#120d0d]">
                <Image
                  src={card.imageSrc}
                  alt=""
                  fill
                  className="object-cover opacity-70"
                  sizes="(max-width: 512px) 100vw, 512px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0909] via-transparent to-transparent" />
              </div>
            )}

            <div className="px-5 py-4">
              {card.subtitle && (
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#a08040]">
                  {card.subtitle}
                </p>
              )}
              <h2
                id="lore-card-title"
                className="mt-1 font-cinzel text-xl uppercase tracking-[0.08em] text-[#efe5dc]"
              >
                {card.title}
              </h2>
              <div className="mt-4 space-y-3 whitespace-pre-wrap text-[14px] leading-relaxed text-[#b8a99e]">
                {card.body.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{renderEmphasis(paragraph)}</p>
                ))}
              </div>
              <div className="mt-4 border-t border-[#241919] pt-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#75685f]">
                  {loreCardUi.effectLabel}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-[#8a9a82]">
                  {card.effect}
                </p>
              </div>
            </div>

            <div className="border-t border-[#241919]">
              <button
                type="button"
                onClick={onClose}
                className="w-full px-4 py-3.5 text-[11px] uppercase tracking-[0.14em] text-[#d4a850] transition hover:bg-[#1a1408]"
              >
                {loreCardUi.close}
              </button>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
