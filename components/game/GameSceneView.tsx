'use client'

import { AnimatePresence, motion } from 'framer-motion'

import { ChoiceList } from '@/components/game/ChoiceList'
import { SceneChronicle } from '@/components/game/SceneChronicle'

import type { Character, Scene } from '@/lib/types/game'

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
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -10,
            scale: 0.98,
          }}
          transition={{
            duration: 0.7,
            ease: 'easeOut',
          }}
        >
          <SceneChronicle scene={scene} />
        </motion.div>
      </AnimatePresence>

      <div className="h-8" />

      <div className="min-h-[220px]">
        <AnimatePresence mode="wait">
          {showChoices && !isLoading && (
            <motion.div
              key={`choices-${scene.id}`}
              initial={{
                opacity: 0,
                y: 14,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 12,
                scale: 0.98,
              }}
              transition={{
                duration: 0.45,
                ease: 'easeOut',
              }}
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
      </div>
    </>
  )
}
