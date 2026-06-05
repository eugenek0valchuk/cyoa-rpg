'use client'

import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

import { useNarrativeReveal } from '@/hooks/useNarrativeReveal'
import { t } from '@/lib/i18n'
import { Scene } from '@/lib/types/game'

import { renderNarrativeEmphasis } from '../shared/NarrativeText'
import { GameIcon } from '../ui/GameIcon'
import { ChronicleCard } from '../shared/ChronicleCard'

interface SceneChronicleProps {
  scene: Scene
  onTypingComplete?: () => void
  /** Hide body when a dedicated encounter modal carries the narrative. */
  hideBody?: boolean
}

export function SceneChronicle({
  scene,
  onTypingComplete,
  hideBody = false,
}: SceneChronicleProps) {
  const textEndRef = useRef<HTMLDivElement>(null)
  const text = scene.description
  const instant = process.env.NEXT_PUBLIC_E2E === '1'

  const { chunks, visibleCount, isRevealing, skip } = useNarrativeReveal({
    text,
    enabled: !hideBody,
    instant,
    onComplete: onTypingComplete,
  })

  useEffect(() => {
    if (!isRevealing) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        skip()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isRevealing, skip])

  useEffect(() => {
    textEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [visibleCount])

  return (
    <ChronicleCard
      title={scene.title}
      subtitle={t.ui.game.chronicleSubtitle}
      icon={<GameIcon type="flag" size={30} noBlend />}
      scrollBody={false}
      className="border-[#2b2320]/90 shadow-[0_0_40px_rgba(0,0,0,0.45)]"
      titleClassName="text-2xl sm:text-[1.65rem]"
      data-testid={`scene-${scene.id}`}
    >
      {!hideBody && (
        <div
          role={isRevealing ? 'button' : undefined}
          tabIndex={isRevealing ? 0 : undefined}
          onClick={() => {
            if (isRevealing) {
              skip()
            }
          }}
          onKeyDown={(event) => {
            if (isRevealing && (event.key === 'Enter' || event.key === ' ')) {
              event.preventDefault()
              skip()
            }
          }}
          className={clsx(
            'relative w-full max-w-[720px] outline-none',
            isRevealing && 'cursor-pointer',
          )}
        >
          <div className="space-y-5 text-[16px] leading-[1.75] text-[#cfc2b8] sm:text-[17px] sm:leading-8">
            {chunks.slice(0, visibleCount).map((chunk, index) => (
              <motion.p
                key={`${scene.id}-${index}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {renderNarrativeEmphasis(chunk)}
              </motion.p>
            ))}
          </div>

          {isRevealing && (
            <p className="mt-5 text-[11px] uppercase tracking-[0.14em] text-[#5a5048]">
              {t.ui.game.narrativeSkipHint}
            </p>
          )}

          <div ref={textEndRef} className="h-px w-full" aria-hidden />
        </div>
      )}
    </ChronicleCard>
  )
}
