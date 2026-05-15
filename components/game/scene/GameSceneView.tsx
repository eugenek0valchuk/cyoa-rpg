'use client'

import { Scene, Character } from '@/lib/types/game'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect, useCallback, useRef } from 'react'
import { SceneChronicle } from '../chronicle/SceneChronicle'
import { fadeSlideUp, sceneTransition } from '../constants/animations'
import { SceneChoices } from './SceneChoices'

interface Props {
  scene: Scene
  character: Character
  isLoading: boolean
  showChoices: boolean
  onChoice: (choiceId: string) => void
}

export function GameSceneView({
  scene,
  character,
  isLoading,
  showChoices,
  onChoice,
}: Props) {
  const [isTyping, setIsTyping] = useState(true)
  const prevSceneIdRef = useRef(scene.id)

  // При СМЕНЕ сцены (когда id меняется) — сбрасываем isTyping в true
  useEffect(() => {
    if (prevSceneIdRef.current !== scene.id) {
      setIsTyping(true)
      prevSceneIdRef.current = scene.id
    }
  }, [scene.id])

  const handleTypingComplete = useCallback(() => {
    setIsTyping(false)
  }, [])

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          {...fadeSlideUp}
          transition={sceneTransition}
        >
          <SceneChronicle scene={scene} onTypingComplete={handleTypingComplete} />
        </motion.div>
      </AnimatePresence>

      <div className="h-4" />

      <SceneChoices
        scene={scene}
        character={character}
        showChoices={showChoices && !isTyping}
        isLoading={isLoading}
        onChoice={onChoice}
      />
    </div>
  )
}
