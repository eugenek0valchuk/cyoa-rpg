'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { CharacterPanel } from '@/components/game/CharacterPanel'
import { ChoiceList } from '@/components/game/ChoiceList'
import { SceneChronicle } from '@/components/game/SceneChronicle'

import { useSceneGenerator } from '@/hooks/useSceneGenerator'

import { isChoiceAvailable } from '@/lib/game/choiceUtils'
import { scenes } from '@/lib/game/scenes'

import { useCharacterStore } from '@/lib/store/characterStore'
import { useGameStore } from '@/lib/store/gameStore'

export default function GamePage() {
  const router = useRouter()

  const character = useCharacterStore((s) => s.character)
  const updateSanity = useCharacterStore((s) => s.updateSanity)
  const updateCorruption = useCharacterStore((s) => s.updateCorruption)
  const addToInventory = useCharacterStore((s) => s.addToInventory)
  const addFlag = useCharacterStore((s) => s.addFlag)
  const resetCharacter = useCharacterStore((s) => s.resetCharacter)

  const currentScene = useGameStore((s) => s.currentScene)
  const setCurrentScene = useGameStore((s) => s.setCurrentScene)
  const pushHistory = useGameStore((s) => s.pushHistory)
  const pushSceneHistory = useGameStore((s) => s.pushSceneHistory)
  const resetGame = useGameStore((s) => s.resetGame)

  const { generateScene } = useSceneGenerator()

  const [isLoading, setIsLoading] = useState(false)
  const [showChoices, setShowChoices] = useState(true)

  useEffect(() => {
    if (!character) {
      router.push('/editor')
    }
  }, [character, router])

  useEffect(() => {
    if (!currentScene) {
      setCurrentScene(scenes.start)
    }
  }, [currentScene, setCurrentScene])

  const handleChoice = useCallback(
    async (choiceId: string) => {
      if (!currentScene || !character || isLoading) {
        return
      }

      const choice = currentScene.options.find((opt) => opt.id === choiceId)

      if (!choice) {
        return
      }

      if (!isChoiceAvailable(choice, character)) {
        return
      }

      setIsLoading(true)
      setShowChoices(false)

      try {
        pushSceneHistory({
          id: currentScene.id,
          title: currentScene.title,
          description: currentScene.description,
        })

        if (choice.effects?.sanity) {
          updateSanity(choice.effects.sanity)
        }

        if (choice.effects?.corruption) {
          updateCorruption(choice.effects.corruption)
        }

        if (choice.effects?.addItem) {
          addToInventory(choice.effects.addItem)
        }

        if (choice.effects?.addFlag) {
          addFlag(choice.effects.addFlag)
        }

        await new Promise((resolve) => setTimeout(resolve, 1200))

        const localScene = scenes[choice.id]

        if (localScene) {
          setCurrentScene(localScene)
          pushHistory(localScene.id)

          await new Promise((resolve) => setTimeout(resolve, 900))

          setShowChoices(true)

          return
        }

        const generatedScene = await generateScene(
          currentScene,
          choice,
          character,
        )

        if (!generatedScene) {
          throw new Error('Failed to generate scene')
        }

        setCurrentScene(generatedScene)
        pushHistory(generatedScene.id)

        await new Promise((resolve) => setTimeout(resolve, 900))

        setShowChoices(true)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    },
    [
      currentScene,
      character,
      isLoading,
      updateSanity,
      updateCorruption,
      addToInventory,
      addFlag,
      setCurrentScene,
      pushHistory,
      pushSceneHistory,
      generateScene,
    ],
  )

  const handleReset = useCallback(() => {
    resetCharacter()
    resetGame()
    router.push('/editor')
  }, [resetCharacter, resetGame, router])

  if (!character || !currentScene) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-[#d7c8bc]">
        <div className="animate-pulse text-sm uppercase tracking-[0.4em] text-[#75685f]">
          DESCENT AWAKENS
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 text-[#e7ded7]">
      <img
        src="/main-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />

      <div className="absolute inset-0 bg-black/70" />

      <div className="absolute inset-0 shadow-[inset_0_0_220px_rgba(0,0,0,0.95)]" />

      <section className="relative z-10 mx-auto max-w-[920px] pt-[18vh] pb-24">
        <div className="mb-10 flex items-start justify-between gap-6">
          <div className="flex-1 text-center">
            <div className="text-[10px] uppercase tracking-[0.7em] text-[#6d5e55]">
              THE CHRONICLE CONTINUES
            </div>

            <div className="mx-auto mt-6 h-px w-48 bg-gradient-to-r from-transparent via-[#7a2222] to-transparent" />
          </div>

          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="
              group
              inline-flex
              items-center
              gap-2
              border
              border-[#241919]
              bg-[#0f0a0a]/80
              px-4
              py-2

              text-[9px]
              uppercase
              tracking-[0.32em]
              text-[#6f6259]

              transition-all
              duration-300

              hover:border-[#4a2323]
              hover:bg-[#161010]
              hover:text-[#d7c8bc]

              disabled:pointer-events-none
              disabled:opacity-40
            "
          >
            <RotateCcw className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-rotate-180" />

            <span>Return</span>
          </button>
        </div>

        <CharacterPanel character={character} />

        <div className="h-6" />

        <motion.div
          animate={{
            opacity: isLoading ? 0.45 : 1,
          }}
          transition={{
            duration: 0.35,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScene.id}
              initial={{
                opacity: 0,
                y: 20,
                filter: 'blur(6px)',
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
              }}
              exit={{
                opacity: 0,
                y: -10,
                filter: 'blur(8px)',
              }}
              transition={{
                duration: 0.7,
                ease: 'easeOut',
              }}
            >
              <SceneChronicle scene={currentScene} />
            </motion.div>
          </AnimatePresence>

          <div className="h-8" />

          <div className="min-h-[220px]">
            <AnimatePresence mode="wait">
              {showChoices && !isLoading && (
                <motion.div
                  key={`choices-${currentScene.id}`}
                  initial={{
                    opacity: 0,
                    y: 14,
                    filter: 'blur(6px)',
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                  }}
                  exit={{
                    opacity: 0,
                    y: 12,
                    filter: 'blur(5px)',
                  }}
                  transition={{
                    duration: 0.45,
                    ease: 'easeOut',
                  }}
                >
                  <ChoiceList
                    options={currentScene.options}
                    character={character}
                    onSelect={handleChoice}
                    isLoading={isLoading}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
