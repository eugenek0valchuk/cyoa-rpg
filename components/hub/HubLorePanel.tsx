'use client'

import Image from 'next/image'
import { Lock, Sparkles } from 'lucide-react'
import { useMemo } from 'react'

import { countUnlockedLoreCards, getLoreSections } from '@/lib/game/loreCards'
import { t } from '@/lib/i18n'
import type { Character } from '@/lib/types/game'
import type { HubState } from '@/lib/types/hub'

interface HubLorePanelProps {
  hub: HubState
  character: Character
  onOpenCard: (cardId: string) => void
}

function ProgressBar({
  value,
  max,
  tone = 'gold',
}: {
  value: number
  max: number
  tone?: 'gold' | 'green'
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  const fill =
    tone === 'green'
      ? 'bg-gradient-to-r from-[#3a5c3a] to-[#6a9a6a]'
      : 'bg-gradient-to-r from-[#6a5020] to-[#d4a850]'

  return (
    <div className="mt-2 h-1.5 w-full overflow-hidden border border-[#2b2320] bg-black/50">
      <div
        className={`h-full transition-all duration-500 ${fill}`}
        style={{ width: `${pct}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
    </div>
  )
}

export function HubLorePanel({ hub, character, onOpenCard }: HubLorePanelProps) {
  const worldLore = t.lore
  const loreUi = t.loreCards.ui
  const copy = t.hub.chronicle

  const sections = useMemo(
    () => getLoreSections(hub, character),
    [hub, character],
  )
  const unlockedTotal = useMemo(
    () => countUnlockedLoreCards(hub, character),
    [hub, character],
  )
  const totalCards = sections.reduce((sum, section) => sum + section.cards.length, 0)
  const unreadTotal = sections.reduce(
    (sum, section) => sum + section.cards.filter((card) => card.unread).length,
    0,
  )

  return (
    <div className="mt-5 space-y-6" data-testid="hub-lore-panel">
      <header className="border border-[#2b2320] bg-[#0a0808]/60 px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#75685f]">
            {worldLore.title}
          </div>
          {unreadTotal > 0 && (
            <span className="inline-flex items-center gap-1 border border-[#5c1f1f]/70 bg-[#160909] px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-[#d46060]">
              <Sparkles className="h-3 w-3" />
              {unreadTotal} {loreUi.newEntry.toLowerCase()}
            </span>
          )}
        </div>
        <p className="mt-2 text-[14px] leading-relaxed text-[#9d8d82]">
          {worldLore.intro}
        </p>
        <p className="mt-3 text-[11px] text-[#6f6259]">
          {copy.loreProgress}: {unlockedTotal} / {totalCards}
        </p>
        <ProgressBar value={unlockedTotal} max={totalCards} />
      </header>

      {sections.map((section) => (
        <section key={section.category}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-[11px] uppercase tracking-[0.16em] text-[#a08040]">
              {loreUi.sections[section.category]}
            </h3>
            <span className="text-[10px] text-[#6f6259]">
              {section.unlockedCount} / {section.cards.length}
            </span>
          </div>
          <ProgressBar
            value={section.unlockedCount}
            max={section.cards.length}
            tone="green"
          />

          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {section.cards.map((card) => (
              <li key={card.id}>
                <button
                  type="button"
                  data-testid={`lore-card-${card.id}`}
                  onClick={() => card.unlocked && onOpenCard(card.id)}
                  disabled={!card.unlocked}
                  className={`group relative flex h-full w-full flex-col overflow-hidden border text-left transition ${
                    card.unlocked
                      ? card.unread
                        ? 'border-[#5c3a2a]/80 bg-[#1a1008]/40 hover:border-[#8a6020]/70'
                        : 'border-[#2b2320] bg-black/25 hover:border-[#6a5020]/60 hover:bg-[#1a1408]/50'
                      : 'cursor-not-allowed border-[#241919]/80 bg-black/15 opacity-80'
                  }`}
                >
                  {card.unread && (
                    <span className="absolute right-2 top-2 z-10 border border-[#8a6020]/80 bg-[#1a1008] px-1.5 py-0.5 text-[8px] uppercase tracking-[0.14em] text-[#d4a850]">
                      {loreUi.newEntry}
                    </span>
                  )}

                  <div className="relative h-28 w-full border-b border-[#241919] bg-[#120d0d]">
                    {card.unlocked && card.imageSrc ? (
                      <>
                        <Image
                          src={card.imageSrc}
                          alt=""
                          fill
                          className="object-cover object-top opacity-80 transition group-hover:opacity-95"
                          sizes="(max-width: 640px) 100vw, 320px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0808] via-[#0a0808]/20 to-transparent" />
                      </>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 bg-[#0d0a0a] px-4">
                        <Lock className="h-5 w-5 text-[#4a3a3a]" />
                        {card.unlockHint && (
                          <p className="text-center text-[10px] leading-relaxed text-[#5c4a4a]">
                            <span className="uppercase tracking-[0.1em] text-[#4a3a3a]">
                              {loreUi.unlockHintLabel}:{' '}
                            </span>
                            {card.unlockHint}
                          </p>
                        )}
                      </div>
                    )}
                    {card.unlocked && card.subtitle && (
                      <span className="absolute left-3 top-3 border border-[#3b2f28]/80 bg-black/55 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-[#a08040]">
                        {card.subtitle}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col px-3 py-3">
                    <div className="font-cinzel text-[13px] uppercase tracking-[0.06em] text-[#d8c9be]">
                      {card.unlocked ? card.title : '···'}
                    </div>
                    <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-[#85776a]">
                      {card.unlocked
                        ? card.effect
                        : (card.teaser ?? loreUi.locked)}
                    </p>
                    {card.unlocked && (
                      <span className="mt-2 text-[10px] uppercase tracking-[0.12em] text-[#8a7a50]">
                        {loreUi.openCard} →
                      </span>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
