import { Character } from '@/lib/types/game'
import { Shield, Swords, Wand2, Package } from 'lucide-react'

interface CharacterPanelProps {
  character: Character
}

const classIcons = {
  warrior: <Swords className="w-4 h-4" />,
  mage: <Wand2 className="w-4 h-4" />,
  rogue: <Shield className="w-4 h-4" />,
}

export function CharacterPanel({ character }: CharacterPanelProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-5 mb-6 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Player</span>
            <span className="font-bold text-white text-lg">
              {character.name}
            </span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-700/50 rounded-full text-sm">
            {classIcons[character.class]}
            <span className="capitalize ml-1">{character.class}</span>
          </div>
        </div>
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1 text-red-400">
            ⚔️ {character.stats.strength}
          </span>
          <span className="flex items-center gap-1 text-green-400">
            🏹 {character.stats.agility}
          </span>
          <span className="flex items-center gap-1 text-blue-400">
            📚 {character.stats.intelligence}
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm text-gray-400 border-t border-gray-700 pt-3">
        <Package className="w-4 h-4" />
        <span>Inventory: {character.inventory.join(', ') || 'empty'}</span>
      </div>
    </div>
  )
}
