'use client'

import { useEffect, useRef, useState } from 'react'

import { t } from '@/lib/i18n'
import { Scene } from '@/lib/types/game'

import { GameIcon } from '../ui/GameIcon'
import { ChronicleCard } from '../shared/ChronicleCard'

interface SceneChronicleProps {
  scene: Scene
  onTypingComplete?: () => void
}

export function SceneChronicle({
  scene,
  onTypingComplete,
}: SceneChronicleProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const indexRef = useRef(0)
  const textEndRef = useRef<HTMLSpanElement>(null)
  const text = scene.description

  useEffect(() => {
    indexRef.current = 0
    setDisplayedText('')
    setIsTyping(true)

    if (text.length <= 2) {
      setDisplayedText(text)
      setIsTyping(false)
      const timeout = setTimeout(() => {
        onTypingComplete?.()
      }, 60)
      return () => clearTimeout(timeout)
    }

    const charsPerTick = 2
    const tick = 38

    const timer = setInterval(() => {
      const next = indexRef.current + charsPerTick
      if (next >= text.length) {
        setDisplayedText(text)
        setIsTyping(false)
        clearInterval(timer)
        const timeout = setTimeout(() => {
          onTypingComplete?.()
        }, 60)
        return () => clearTimeout(timeout)
      } else {
        setDisplayedText(text.slice(0, next))
        indexRef.current = next
      }
    }, tick)

    return () => clearInterval(timer)
  }, [text, onTypingComplete])

  useEffect(() => {
    textEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [displayedText])

  return (
    <ChronicleCard
      title={scene.title}
      subtitle={t.ui.game.chronicleSubtitle}
      icon={<GameIcon type="flag" size={30} noBlend />}
      scrollBody={false}
      className="border-[#2b2320]/90 shadow-[0_0_40px_rgba(0,0,0,0.45)]"
      titleClassName="text-2xl sm:text-[1.65rem]"
    >
      <div className="relative w-full max-w-[720px] space-y-4 whitespace-pre-wrap text-[16px] leading-[1.75] text-[#cfc2b8] sm:text-[17px] sm:leading-8">
        {displayedText}

        {isTyping && (
          <span className="ml-0.5 inline-block h-5 w-2 animate-pulse bg-[#8e1f1f] align-middle" />
        )}
        <span ref={textEndRef} className="block h-px w-full" aria-hidden />
      </div>
    </ChronicleCard>
  )
}
