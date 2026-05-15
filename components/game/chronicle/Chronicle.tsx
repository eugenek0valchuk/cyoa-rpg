import type { Scene } from '@/lib/types/game'
import { ChronicleCard } from '../shared/ChronicleCard'

interface ChronicleProps {
  history: {
    id: string
    title: string
    description: string
  }[]
  currentScene: Scene
}

export function Chronicle({ history, currentScene }: ChronicleProps) {
  return (
    <ChronicleCard
      title="The Long Descent"
      subtitle="Chronicle"
      maxHeight="max-h-[25vh]"
    >
      <div className="space-y-14">
        {history.map((scene) => (
          <div key={scene.id} className="opacity-40">
            <div className="text-[10px] uppercase tracking-[0.35em] text-[#6c5f57]">
              Past Memory
            </div>

            <h3 className="font-cinzel mt-3 text-2xl uppercase tracking-[0.08em] text-[#bcaea2]">
              {scene.title}
            </h3>

            <div className="mt-5 space-y-6 text-[15px] leading-8 text-[#8e8177]">
              {scene.description
                .split('\n')
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>

            <div className="mt-10 h-px bg-gradient-to-r from-[#2a1f1f] to-transparent" />
          </div>
        ))}

        <div>
          <div className="text-[10px] uppercase tracking-[0.35em] text-[#8e1f1f]">
            Present Moment
          </div>

          <h3 className="font-cinzel mt-3 text-4xl uppercase tracking-[0.12em] text-[#efe5dc]">
            {currentScene.title}
          </h3>

          <div className="mt-6 h-px w-40 bg-gradient-to-r from-[#8e1f1f] to-transparent" />

          <div className="mt-8 space-y-7 text-[16px] leading-9 text-[#c7bbb0]">
            {currentScene.description
              .split('\n')
              .filter(Boolean)
              .map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
          </div>
        </div>
      </div>
    </ChronicleCard>
  )
}
