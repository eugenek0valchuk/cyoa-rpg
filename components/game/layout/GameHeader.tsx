'use client'

import { RotateCcw, DoorOpen, Skull } from 'lucide-react'

import { GameIcon } from '@/components/game/ui/GameIcon'
import { t } from '@/lib/i18n'
import type { ExtractBlockReason } from '@/lib/game/extraction'
import type { RaidModifierDef } from '@/lib/game/raidModifiers'
import type { RaidZone } from '@/lib/game/zones'

interface Props {
  isLoading: boolean
  extractAvailable: boolean
  extractBlockReason: ExtractBlockReason
  hasSigil: boolean
  raidDepth: number
  minExtractDepth: number
  raidZone: RaidZone
  raidModifier: RaidModifierDef | null
  isEndingScene: boolean
  onExtract: () => void
  onAbandon: () => void
  onReset: () => void
}

function getExtractHint(
  reason: ExtractBlockReason,
  hasSigil: boolean,
  raidDepth: number,
  minExtractDepth: number,
): string | null {
  const { ui: hubText } = t.hub

  if (reason === 'available') {
    return hubText.extractAvailable
  }

  if (reason === 'need_depth') {
    return hubText.extractHintDepth
      .replace('{depth}', String(raidDepth))
      .replace('{min}', String(minExtractDepth))
  }

  if (reason === 'need_sigil_site') {
    return hubText.extractHintSigilSite
  }

  if (hasSigil) {
    return hubText.extractHintSigilSite
  }

  return `${hubText.extractHintExitSite} ${hubText.extractHintSigil}`
}

export function GameHeader({
  isLoading,
  extractAvailable,
  extractBlockReason,
  hasSigil,
  raidDepth,
  minExtractDepth,
  raidZone,
  raidModifier,
  isEndingScene,
  onExtract,
  onAbandon,
  onReset,
}: Props) {
  const { game } = t.ui
  const { ui: hubText } = t.hub
  const { ui: raidText } = t.raid

  const extractHint = getExtractHint(
    extractBlockReason,
    hasSigil,
    raidDepth,
    minExtractDepth,
  )

  return (
    <div className="mb-4 space-y-3">
      <div className="text-[10px] uppercase tracking-[0.35em] text-[#6d5e55]">
        {game.headerEyebrow}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 border border-[#2b2320] bg-[#0d0909]/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-[#9d8d82]">
              <GameIcon type="flag" size={24} noBlend />
              {raidText.zones[raidZone]}
            </span>
            <span className="inline-flex items-center gap-1.5 border border-[#2b2320] bg-[#0d0909]/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-[#85776a]">
              {hubText.bestDepth} {raidDepth}
            </span>
            {raidModifier && (
              <span
                className="inline-flex items-center gap-1.5 border border-[#4a2323] bg-[#160909]/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.08em] text-[#d46060]"
                title={raidModifier.hint}
              >
                <GameIcon type="corruption" size={24} noBlend />
                {raidModifier.name}
              </span>
            )}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-[#75685f]">
            {raidText.zoneHints[raidZone]}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 lg:shrink-0 lg:justify-end">
          {!isEndingScene && (
            <>
              <button
                type="button"
                onClick={onExtract}
                disabled={isLoading || !extractAvailable}
                title={extractHint ?? undefined}
                className="inline-flex items-center gap-1.5 border border-[#4a2323] bg-[#160909]/90 px-3 py-2 text-[9px] uppercase tracking-[0.18em] text-[#d46060] transition hover:bg-[#220d0d] disabled:cursor-help disabled:opacity-45"
              >
                <DoorOpen className="h-3 w-3" />
                {hubText.extract}
              </button>
              <button
                type="button"
                onClick={onAbandon}
                disabled={isLoading}
                title={hubText.abandonHint}
                className="inline-flex items-center gap-1.5 border border-[#3b2a2a] bg-[#120909]/90 px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-[#a08080] transition hover:border-[#5c1f1f] hover:text-[#d46060] disabled:opacity-40"
              >
                <Skull className="h-3 w-3" />
                {hubText.abandon}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onReset}
            disabled={isLoading}
            title={isEndingScene ? undefined : game.returnHint}
            className="inline-flex items-center gap-1.5 border border-[#241919] bg-[#0f0a0a]/80 px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-[#6f6259] transition hover:border-[#4a2323] hover:text-[#d7c8bc] disabled:opacity-40"
          >
            <RotateCcw className="h-3 w-3" />
            {isEndingScene ? hubText.endingReturn : game.return}
          </button>
        </div>
      </div>

      {!isEndingScene && extractHint && !extractAvailable && (
        <p className="border border-[#241919] bg-[#0a0808]/60 px-3 py-2 text-[10px] leading-relaxed text-[#85776a]">
          {extractHint}
        </p>
      )}

      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#7a2222]/50 to-transparent" />
    </div>
  )
}
