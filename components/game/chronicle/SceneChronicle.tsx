'use client'

import { Scene } from '@/lib/types/game'
import { ScrollText } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { ChronicleCard } from '../shared/ChronicleCard'

interface SceneChronicleProps {
  scene: Scene
}

export function SceneChronicle({ scene }: SceneChronicleProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const indexRef = useRef(0)
  const text = scene.description

  useEffect(() => {
    indexRef.current = 0
    setDisplayedText('')
    setIsTyping(true)

    const charsPerTick = 3
    const tick = 8

    const timer = setInterval(() => {
      const next = indexRef.current + charsPerTick
      if (next >= text.length) {
        setDisplayedText(text)
        setIsTyping(false)
        clearInterval(timer)
      } else {
        setDisplayedText(text.slice(0, next))
        indexRef.current = next
      }
    }, tick)

    return () => clearInterval(timer)
  }, [text])

  return (
    <ChronicleCard
      title={scene.title}
      subtitle="Chronicle"
      icon={<ScrollText className="h-5 w-5 text-[#8e1f1f]" />}
      contentClassName="max-h-[420px] overflow-y-auto"
    >
      <div className="w-full max-w-[720px]">
        <div className="relative space-y-4 whitespace-pre-wrap text-[18px] leading-8 text-[#cfc2b8]">
          {displayedText}

          {isTyping && (
            <span className="inline-block h-4 w-2 animate-pulse bg-[#8e1f1f]" />
          )}
        </div>
      </div>
    </ChronicleCard>
  )
}
