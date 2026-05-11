// components/game/SceneDisplay.tsx
import { Scene } from '@/lib/types/game'
import { BookOpen } from 'lucide-react'

interface SceneDisplayProps {
  scene: Scene
}

export function SceneDisplay({ scene }: SceneDisplayProps) {
  return (
    <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 mb-6 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-blue-400" />
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {scene.title}
        </h2>
      </div>
      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
        {scene.description}
      </p>
    </div>
  )
}
