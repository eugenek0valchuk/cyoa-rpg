import { ChevronRight } from 'lucide-react'

import { isChoiceAvailable } from '@/lib/game/choiceUtils'
import type { Character, Choice } from '@/lib/types/game'

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
  const availableOptions = options.filter((option) =>
    isChoiceAvailable(option, character),
  )

  return (
    <div className="mt-8 space-y-4">
      {availableOptions.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          disabled={isLoading}
          className="
              group
              relative
              w-full
              overflow-hidden

              border
              border-[#2b2320]

              bg-[linear-gradient(to_bottom,#120c0c,#0b0808)]

              px-6
              py-6

              text-left

              transition-all
              duration-500

              hover:border-[#4a2323]
              hover:bg-[linear-gradient(to_bottom,#181010,#0d0909)]
              hover:shadow-[0_0_30px_rgba(80,20,20,0.25)]
            "
        >
          <div className="absolute inset-y-0 left-0 w-[2px] bg-[#8e1f1f] opacity-40 transition-all duration-500 group-hover:w-[4px] group-hover:opacity-100" />

          <div className="flex items-center justify-between gap-6">
            <div>
              <div className="mb-2 text-[10px] uppercase tracking-[0.35em] text-[#75685f]">
                Decision
              </div>

              <div className="text-[16px] leading-8 text-[#ddd2c7] transition-colors duration-300 group-hover:text-[#f2e7dd]">
                {option.text}
              </div>
            </div>

            <ChevronRight className="h-5 w-5 shrink-0 text-[#6d5a52] transition-all duration-500 group-hover:translate-x-1 group-hover:text-[#b44d4d]" />
          </div>
        </button>
      ))}
    </div>
  )
}
