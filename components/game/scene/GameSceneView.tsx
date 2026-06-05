'use client'

import type { RaidModifierId } from '@/lib/game/raidModifiers'
import { Character, Scene } from '@/lib/types/game'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { isRaidEndingScene } from '@/lib/game/isRaidEndingScene'
import { SceneChronicle } from '../chronicle/SceneChronicle'
import { fadeSlideUp, sceneTransition } from '../constants/animations'
import { EndingActions } from './EndingActions'
import { SceneChoices } from './SceneChoices'

interface Props {
  scene: Scene
  character: Character
  isLoading: boolean
  journalEntries?: string[]
  raidModifierId?: RaidModifierId | null
  roomMarks?: string[]
  showChoices: boolean
  extractAvailable?: boolean
  onExtract?: () => void
  onChoice: (choiceIndex: number) => void
  onRiskChoice?: (choiceIndex: number) => void
  onReturnToChamber?: () => void
}

export function GameSceneView({
  scene,
  character,
  isLoading,
  journalEntries = [],
  raidModifierId,
  roomMarks = [],
  showChoices,
  extractAvailable,
  onExtract,
  onChoice,
  onRiskChoice,
  onReturnToChamber,
}: Props) {
  const [isTyping, setIsTyping] = useState(true)
  const prevSceneIdRef = useRef(scene.id)
  const isEnding = isRaidEndingScene(scene)

  useEffect(() => {
    if (prevSceneIdRef.current !== scene.id) {
      setIsTyping(true)
      prevSceneIdRef.current = scene.id
    }
  }, [scene.id])

  const handleTypingComplete = useCallback(() => {
    setIsTyping(false)
  }, [])

  const revealActions = showChoices && !isTyping && !isLoading

  return (
    <div className="flex flex-col gap-3">
      <div className="max-h-[min(34vh,280px)] min-h-0 overflow-y-auto chronicle-scrollbar pr-0.5">
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.id}
            {...fadeSlideUp}
            transition={sceneTransition}
          >
            <SceneChronicle
              scene={scene}
              onTypingComplete={handleTypingComplete}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="shrink-0 border-t border-[#241919]/90 bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-3">
      {isEnding && revealActions && onReturnToChamber ? (
        <EndingActions
          isLoading={isLoading}
          onReturnToChamber={onReturnToChamber}
        />
      ) : (
        <SceneChoices
          scene={scene}
          character={character}
          journalEntries={journalEntries}
          raidModifierId={raidModifierId}
          roomMarks={roomMarks}
          showChoices={revealActions}
          isLoading={isLoading}
          extractAvailable={extractAvailable}
          onExtract={onExtract}
          onChoice={onChoice}
          onRiskChoice={onRiskChoice}
        />
      )}
      </div>
    </div>
  )
}
