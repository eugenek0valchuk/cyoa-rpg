// components/game/ChoiceList.tsx
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
    <div className="space-y-3">
      {options.map((option) => {
        const available = isChoiceAvailable(option, character)
        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            disabled={!available || isLoading}
            className={`
              group w-full text-left p-4 rounded-xl border transition-all duration-200
              ${
                available
                  ? 'bg-gray-800/50 border-gray-700 hover:border-blue-500 hover:bg-gray-800 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]'
                  : 'bg-gray-900/50 border-gray-800 text-gray-500 cursor-not-allowed opacity-70'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{option.text}</span>
              {available ? (
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              ) : (
                <Lock className="w-4 h-4 text-gray-600" />
              )}
            </div>
            {!available && (
              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Requires intelligence ≥5</span>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
