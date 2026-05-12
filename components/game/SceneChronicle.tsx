import { Scene } from '@/lib/types/game'

import { ScrollText } from 'lucide-react'

interface SceneChronicleProps {
  scene: Scene
}

export function SceneChronicle({ scene }: SceneChronicleProps) {
  return (
    <section className="mb-8 overflow-hidden border border-[#2b2320] bg-[#0d0909]/95 shadow-[0_0_40px_rgba(0,0,0,0.45)]">
      <div className="border-b border-[#241919] bg-[#120d0d] px-6 py-4">
        <div className="flex items-center gap-3">
          <ScrollText className="h-5 w-5 text-[#8e1f1f]" />

          <div>
            <div className="text-[10px] uppercase tracking-[0.35em] text-[#75685f]">
              Chronicle
            </div>

            <h2 className="mt-1 font-cinzel text-2xl uppercase tracking-[0.08em] text-[#ece2d9]">
              {scene.title}
            </h2>
          </div>
        </div>
      </div>

      <div className="max-h-[420px] overflow-y-auto px-7 py-7">
        <div className="mx-auto max-w-[720px]">
          <div className="space-y-6 text-[16px] leading-9 text-[#cfc2b8] whitespace-pre-wrap">
            {scene.description}
          </div>
        </div>
      </div>
    </section>
  )
}
