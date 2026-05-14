import { Scene } from '@/lib/types/game'
import { ScrollText } from 'lucide-react'
import { ChronicleCard } from '../shared/ChronicleCard'

interface SceneChronicleProps {
  scene: Scene
}

export function SceneChronicle({ scene }: SceneChronicleProps) {
  return (
    <ChronicleCard
      title={scene.title}
      subtitle="Chronicle"
      icon={<ScrollText className="h-5 w-5 text-[#8e1f1f]" />}
      contentClassName="max-h-[420px] overflow-y-auto"
    >
      <div className="w-full max-w-[720px]">
        <div className="space-y-6 whitespace-pre-wrap text-[16px] leading-9 text-[#cfc2b8]">
          {scene.description}
        </div>
      </div>
    </ChronicleCard>
  )
}
