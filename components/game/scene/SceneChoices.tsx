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
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-5">
            <div className="relative flex items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-[#2b1a1a] border-t-[#8e1f1f]" />
              <div className="absolute h-6 w-6 rounded-full border border-[#4a2a2a]/40" />
            </div>
            <div className="text-[14px] uppercase tracking-[0.35em] text-[#6d5d53]">
              The abyss stirs...
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
