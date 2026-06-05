'use client'

import { useState } from 'react'
import { ChevronDown, RotateCcw, DoorOpen, Skull } from 'lucide-react'

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
  flagCount: number
  journalCount?: number
  showNewFlagHint: boolean
  onOpenChronicle: () => void
  onExtract: () => void
  onAbandon: () => void
  onReset: () => void
}

function getExtractHint(
  reason: ExtractBlockReason,
  hasSigil: boolean,
  raidDepth: number,
  minExtractDepth: number,
): { summary: string; detail?: string } | null {
  const { ui: hubText } = t.hub

  if (reason === 'available') {
    return { summary: hubText.extractAvailable }
  }

  if (reason === 'need_depth') {
    return {
      summary: hubText.extractHintDepth
        .replace('{depth}', String(raidDepth))
        .replace('{min}', String(minExtractDepth)),
    }
  }

  if (reason === 'need_sigil_site') {
    return { summary: hubText.extractHintSigilSite }
  }

  if (hasSigil) {
    return { summary: hubText.extractHintSigilSite }
  }

  return {
    summary: hubText.extractHintShort,
    detail: `${hubText.extractHintExitSite} ${hubText.extractHintSigil}`,
  }
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
  flagCount,
  journalCount = 0,
  showNewFlagHint,
  onOpenChronicle,
  onExtract,
  onAbandon,
  onReset,
}: Props) {
  const [extractExpanded, setExtractExpanded] = useState(false)
  const { game } = t.ui
  const { ui: hubText } = t.hub
  const { ui: raidText } = t.raid
  const { ui: chronicleText } = t.raidChronicle
  const { ui: diaryText } = t.journal

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
          <button
            type="button"
            onClick={onOpenChronicle}
            disabled={isLoading}
            title={chronicleText.openHint}
            className={`relative inline-flex items-center gap-1.5 border px-3 py-2 text-[9px] uppercase tracking-[0.16em] transition disabled:opacity-40 ${
              showNewFlagHint
                ? 'animate-pulse border-[#4a5c4a] bg-[#0d120d]/90 text-[#b4c27d] shadow-[0_0_16px_rgba(120,160,100,0.15)]'
                : 'border-[#2b3528] bg-[#0a0d0a]/90 text-[#8a9a82] hover:border-[#4a5c4a] hover:text-[#b4c27d]'
            }`}
          >
            <GameIcon type="flag" size={24} noBlend />
            {chronicleText.openChronicle}
                {flagCount > 0 && (
                  <span className="ml-0.5 inline-flex min-w-[1.1rem] items-center justify-center border border-[#4a5c4a]/60 bg-[#121812] px-1 text-[9px] text-[#b4c27d]">
                    {flagCount}
                  </span>
                )}
                {journalCount > 0 && (
                  <span className="ml-0.5 inline-flex min-w-[1.1rem] items-center justify-center border border-[#3a3a4a]/60 bg-[#101018] px-1 text-[9px] text-[#a8a8c8]">
                    {journalCount}
                  </span>
                )}
          </button>
          {!isEndingScene && (
            <>
              <button
                type="button"
                onClick={onExtract}
                disabled={isLoading || !extractAvailable}
                title={extractHint?.summary ?? undefined}
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
            title={isEndingScene ? game.endingReturnHint : game.returnHint}
            className={`inline-flex items-center gap-1.5 border px-3 py-2 text-[9px] uppercase tracking-[0.16em] transition disabled:opacity-40 ${
              isEndingScene
                ? 'border-2 border-[#5c1f1f] bg-[#160909] text-[#d46060] hover:bg-[#220d0d]'
                : 'border-[#241919] bg-[#0f0a0a]/80 text-[#6f6259] hover:border-[#4a2323] hover:text-[#d7c8bc]'
            }`}
          >
            <RotateCcw className="h-3 w-3" />
            {isEndingScene ? hubText.endingReturn : game.return}
          </button>
        </div>
      </div>

      {!isEndingScene && showNewFlagHint && (
        <button
          type="button"
          onClick={onOpenChronicle}
          className="w-full border border-[#3a4a3a]/80 bg-[#0d120d]/70 px-3 py-2 text-left text-[11px] leading-relaxed text-[#9aab92] transition hover:border-[#4a5c4a] hover:text-[#b4c27d]"
        >
          {diaryText.newEntryBanner}
        </button>
      )}

      {!isEndingScene && extractHint && !extractAvailable && (
        <div className="border border-[#241919] bg-[#0a0808]/60 px-3 py-2 text-[10px] leading-relaxed text-[#85776a]">
          <p>{extractHint.summary}</p>
          {extractHint.detail && (
            <>
              <button
                type="button"
                onClick={() => setExtractExpanded((value) => !value)}
                className="mt-1.5 inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.12em] text-[#6d5e55] transition hover:text-[#9d8d82]"
              >
                <ChevronDown
                  className={`h-3 w-3 transition ${extractExpanded ? 'rotate-180' : ''}`}
                />
                {extractExpanded ? game.extractHintLess : game.extractHintMore}
              </button>
              {extractExpanded && (
                <p className="mt-2 text-[10px] leading-relaxed text-[#75685f]">
                  {extractHint.detail}
                </p>
              )}
            </>
          )}
        </div>
      )}

      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#7a2222]/50 to-transparent" />
    </div>
  )
}
