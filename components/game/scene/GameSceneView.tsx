'use client'

import { Scene, Character } from '@/lib/types/game'
import { AnimatePresence, motion } from 'framer-motion'
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
  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          {...fadeSlideUp}
          transition={sceneTransition}
        >
          <SceneChronicle scene={scene} />
        </motion.div>
      </AnimatePresence>

      <div className="h-8" />

      <SceneChoices
        scene={scene}
        character={character}
        showChoices={showChoices}
        isLoading={isLoading}
        onChoice={onChoice}
      />
    </div>
  )
}
