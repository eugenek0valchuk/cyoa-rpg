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
    <div className="relative min-h-[220px]">
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

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3b2a2a] border-t-[#8e1f1f]" />
            <div className="text-[11px] uppercase tracking-[0.3em] text-[#6d5d53]">
              The abyss stirs...
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
