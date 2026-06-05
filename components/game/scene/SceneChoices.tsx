'use client'

import { ChevronRight, DoorOpen } from 'lucide-react'
import type { RaidModifierId } from '@/lib/game/raidModifiers'
import { Scene, Character } from '@/lib/types/game'
import { AnimatePresence, motion } from 'framer-motion'
import { choiceAnimation, sceneTransition } from '../constants/animations'
import { ChoiceList } from './ChoiceList'
import { t } from '@/lib/i18n'

interface SceneChoicesProps {
  scene: Scene
  character: Character
  journalEntries?: string[]
  raidModifierId?: RaidModifierId | null
  roomMarks?: string[]
  showChoices: boolean
  isLoading: boolean
  extractAvailable?: boolean
  onExtract?: () => void
  onChoice: (choiceIndex: number) => void
  onRiskChoice?: (choiceIndex: number) => void
}

export function SceneChoices({
  scene,
  character,
  journalEntries = [],
  raidModifierId,
  roomMarks = [],
  showChoices,
  isLoading,
  extractAvailable = false,
  onExtract,
  onChoice,
  onRiskChoice,
}: SceneChoicesProps) {
  const { ui: raidText } = t.raid

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {showChoices && !isLoading && (
          <motion.div
            key={`choices-${scene.id}`}
            {...choiceAnimation}
            transition={sceneTransition}
            className="space-y-3"
          >
            {extractAvailable && onExtract && (
              <button
                type="button"
                onClick={onExtract}
                className="group relative w-full border-2 border-[#4a2323] bg-[#160909]/95 text-left transition hover:border-[#8e1f1f] hover:bg-[#220d0d] hover:shadow-[0_0_24px_rgba(92,31,31,0.18)]"
              >
                <div className="relative flex items-start gap-3 px-4 py-3.5 sm:px-5 sm:py-4">
                  <DoorOpen className="mt-0.5 h-4 w-4 shrink-0 text-[#d46060]" />
                  <div className="min-w-0 flex-1">
                    <div className="font-cinzel text-[15px] uppercase tracking-[0.08em] text-[#d46060] sm:text-[17px]">
                      {raidText.extractInScene}
                    </div>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-[#9d8d82]">
                      {raidText.extractInSceneHint}
                    </p>
                  </div>
                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#75685f] transition-transform group-hover:translate-x-0.5 group-hover:text-[#d46060]" />
                </div>
              </button>
            )}

            <ChoiceList
              options={scene.options}
              sceneId={scene.id}
              character={character}
              journalEntries={journalEntries}
              raidModifierId={raidModifierId}
              roomMarks={roomMarks}
              onSelect={onChoice}
              onRiskSelect={onRiskChoice}
              isLoading={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#2b1a1a] border-t-[#8e1f1f]" />
            </div>
            <div className="text-[12px] uppercase tracking-[0.28em] text-[#75685f]">
              {raidText.loadingScene}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
