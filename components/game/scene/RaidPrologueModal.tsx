'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

import type { PrologueSlide } from '@/lib/game/prologue'
import { zLayers } from '@/lib/ui/layers'
import { prologueUi } from '@/locales/ru/prologue'

interface RaidPrologueModalProps {
  open: boolean
  slides: PrologueSlide[]
  onComplete: () => void
}

export function RaidPrologueModal({
  open,
  slides,
  onComplete,
}: RaidPrologueModalProps) {
  const [index, setIndex] = useState(0)

  if (slides.length === 0) {
    return null
  }

  const slide = slides[index] ?? slides[0]!
  const isLast = index >= slides.length - 1

  const advance = () => {
    if (isLast) {
      setIndex(0)
      onComplete()
      return
    }

    setIndex((value) => value + 1)
  }

  const skip = () => {
    setIndex(0)
    onComplete()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={`fixed inset-0 ${zLayers.raidPrologue} flex items-center justify-center bg-black/88 px-4`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key={slide.id}
            className="flex w-full max-w-md flex-col overflow-hidden border border-[#3b2a2a] bg-[#0d0909]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="relative h-44 border-b border-[#241919] bg-[#120d0d] sm:h-52">
              {slide.imageSrc ? (
                <Image
                  src={slide.imageSrc}
                  alt={slide.imageAlt ?? ''}
                  fill
                  className="object-cover opacity-75"
                  sizes="(max-width: 448px) 100vw, 448px"
                />
              ) : (
                <div className="h-full bg-gradient-to-b from-[#1a1010] to-[#0d0909]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0909] via-[#0d0909]/20 to-transparent" />
              <p className="absolute left-4 top-4 text-[10px] uppercase tracking-[0.2em] text-[#75685f]">
                {prologueUi.eyebrow} · {index + 1}/{slides.length}
              </p>
            </div>

            <div className="px-5 py-5">
              <h2 className="font-cinzel text-xl uppercase tracking-[0.08em] text-[#efe5dc]">
                {slide.title}
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-[#b8a99e]">
                {slide.body}
              </p>
            </div>

            <div className="flex border-t border-[#241919]">
              <button
                type="button"
                onClick={skip}
                className="flex-1 border-r border-[#241919] px-4 py-3.5 text-[11px] uppercase tracking-[0.14em] text-[#75685f] transition hover:bg-[#0a0808]"
              >
                {prologueUi.skip}
              </button>
              <button
                type="button"
                onClick={advance}
                className="flex-1 px-4 py-3.5 text-[11px] uppercase tracking-[0.14em] text-[#d46060] transition hover:bg-[#160909]"
              >
                {isLast ? prologueUi.begin : prologueUi.next}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
