import { Character, Choice } from '@/lib/types/game'

import { isChoiceAvailable } from '@/lib/game/choiceUtils'

import { ChevronRight, Lock } from 'lucide-react'

interface ChoiceListProps {
  options: Choice[]

  character: Character

  onSelect: (choiceId: string) => void

  isLoading: boolean
}

export function ChoiceList({
  options,
  character,
  onSelect,
  isLoading,
}: ChoiceListProps) {
  return (
    <div className="space-y-4">
      {options.map((option) => {
        const available = isChoiceAvailable(option, character)

        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            disabled={!available || isLoading}
            className={`
              group
              relative
              w-full
              overflow-hidden
              border
              px-6
              py-5
              text-left
              transition-all
              duration-300

              ${
                available
                  ? `
                    border-[#2b2320]
                    bg-[#110c0c]/95
                    hover:border-[#5c1f1f]
                    hover:bg-[#161010]
                  `
                  : `
                    border-[#211919]
                    bg-[#0a0707]/90
                    opacity-50
                    cursor-not-allowed
                  `
              }
            `}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(142,31,31,0.08),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative z-10 flex items-center justify-between gap-5">
              <div>
                <div className="text-[10px] uppercase tracking-[0.35em] text-[#75685f]">
                  Decision
                </div>

                <div className="mt-3 text-[15px] leading-7 text-[#d7c8bc]">
                  {option.text}
                </div>
              </div>

              {available ? (
                <ChevronRight className="h-5 w-5 shrink-0 text-[#8e1f1f] transition-transform duration-300 group-hover:translate-x-1" />
              ) : (
                <Lock className="h-4 w-4 shrink-0 text-[#5a4d47]" />
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
