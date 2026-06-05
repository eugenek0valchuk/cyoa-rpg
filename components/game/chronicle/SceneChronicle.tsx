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
  const scrollRef = useRef<HTMLDivElement>(null)
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
    if (!scrollRef.current) return
    const container = scrollRef.current
    const targetScroll = container.scrollHeight - container.clientHeight

    if (targetScroll > container.scrollTop) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            top: targetScroll,
            behavior: 'smooth',
          })
        }
      })
    }
  }, [displayedText])

  return (
    <ChronicleCard
      title={scene.title}
      subtitle={t.ui.game.chronicleSubtitle}
      icon={<GameIcon type="flag" size={30} noBlend />}
      maxHeight="max-h-[min(38vh,420px)]"
      className="border-[#2b2320]/90 shadow-[0_0_40px_rgba(0,0,0,0.45)]"
      titleClassName="text-2xl sm:text-[1.65rem]"
    >
      <div
        ref={scrollRef}
        className="w-full max-w-[720px] max-h-full overflow-y-auto chronicle-scrollbar scroll-smooth"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
        }}
      >
        <div className="relative space-y-4 whitespace-pre-wrap text-[16px] leading-[1.75] text-[#cfc2b8] sm:text-[17px] sm:leading-8">
          {displayedText}

          {isTyping && (
            <span className="inline-block h-5 w-2 animate-pulse bg-[#8e1f1f] align-middle ml-0.5" />
          )}
        </div>
      </div>
    </ChronicleCard>
  )
}
