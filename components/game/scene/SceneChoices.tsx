'use client'

import { Scene, Character } from '@/lib/types/game'
import { AnimatePresence, motion } from 'framer-motion'
import { choiceAnimation, sceneTransition } from '../constants/animations'
import { ChoiceList } from './ChoiceList'

interface SceneChoicesProps {
  scene: Scene
  character: Character
  showChoices: boolean
  isLoading: boolean
  onChoice: (choiceId: string) => void
}

export function SceneChoices({
  scene,
  character,
  showChoices,
  isLoading,
  onChoice,
}: SceneChoicesProps) {
  return (
    <AnimatePresence mode="wait">
      {showChoices && !isLoading && (
        <motion.div
          key={`choices-${scene.id}`}
          {...choiceAnimation}
          transition={sceneTransition}
        >
          <ChoiceList
            options={scene.options}
            character={character}
            onSelect={onChoice}
            isLoading={isLoading}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
