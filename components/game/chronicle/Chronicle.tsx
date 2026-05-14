import type { Scene } from '@/lib/types/game'

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
    <section className="relative overflow-hidden border border-[#2a211d] bg-[#090707]/95">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(142,31,31,0.08),transparent_60%)]" />

      <div className="relative z-10">
        <div className="border-b border-[#221917] px-8 py-6">
          <div className="text-[10px] uppercase tracking-[0.5em] text-[#75685f]">
            Chronicle
          </div>

          <h2 className="font-cinzel mt-4 text-3xl uppercase tracking-[0.14em] text-[#efe5dc]">
            The Long Descent
          </h2>
        </div>

        <div className="max-h-[900px] overflow-y-auto px-8 py-10">
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
        </div>
      </div>
    </section>
  )
}
