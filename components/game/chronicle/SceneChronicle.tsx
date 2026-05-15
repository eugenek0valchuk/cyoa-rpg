'use client'

import { Scene } from '@/lib/types/game'
import { ScrollText } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { ChronicleCard } from '../shared/ChronicleCard'

interface SceneChronicleProps {
  scene: Scene
  onTypingComplete?: () => void
}

export function SceneChronicle({ scene, onTypingComplete }: SceneChronicleProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const indexRef = useRef(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const text = scene.description

  useEffect(() => {
    indexRef.current = 0
    setDisplayedText('')
    setIsTyping(true)

    // Если текст очень короткий — показываем сразу и завершаем
    if (text.length <= 2) {
      setDisplayedText(text)
      setIsTyping(false)
      // Даем время на paint перед callback
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
        // Даем время на paint перед callback
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

  // Прокручиваем за текстом по мере его появления — плавно и непрерывно
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
      subtitle="Chronicle"
      icon={<ScrollText className="h-5 w-5 text-[#8e1f1f]" />}
      maxHeight="max-h-[28vh]"
    >
      <div
        ref={scrollRef}
        className="w-full max-w-[720px] max-h-full overflow-y-auto chronicle-scrollbar scroll-smooth"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
        }}
      >
        <div className="relative space-y-4 whitespace-pre-wrap text-[18px] leading-8 text-[#cfc2b8]">
          {displayedText}

          {isTyping && (
            <span className="inline-block h-5 w-2 animate-pulse bg-[#8e1f1f] align-middle ml-0.5" />
          )}
        </div>
      </div>
    </ChronicleCard>
  )
}
