'use client'

import { RotateCcw, DoorOpen } from 'lucide-react'

import { t } from '@/lib/i18n'
import type { ExtractBlockReason } from '@/lib/game/extraction'

interface Props {
  isLoading: boolean
  extractAvailable: boolean
  extractBlockReason: ExtractBlockReason
  hasSigil: boolean
  raidDepth: number
  minExtractDepth: number
  isEndingScene: boolean
  onExtract: () => void
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
  isEndingScene,
  onExtract,
  onReset,
}: Props) {
  const { game } = t.ui
  const { ui: hubText } = t.hub

  const extractHint = getExtractHint(
    extractBlockReason,
    hasSigil,
    raidDepth,
    minExtractDepth,
  )

  return (
    <div className="mb-6 flex items-start justify-between gap-6">
      <div className="flex-1 text-center">
        <div className="text-[10px] uppercase tracking-[0.7em] text-[#6d5e55]">
          {game.headerEyebrow}
        </div>
        <div className="mt-2 text-[11px] uppercase tracking-[0.3em] text-[#75685f]">
          {hubText.bestDepth}: {raidDepth}
        </div>
        <div className="mx-auto mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#7a2222] to-transparent" />
      </div>

      <div className="flex max-w-[240px] flex-col gap-2">
        {!isEndingScene && (
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={onExtract}
              disabled={isLoading || !extractAvailable}
              className="group inline-flex items-center gap-2 border border-[#4a2323] bg-[#160909]/90 px-4 py-2 text-[9px] uppercase tracking-[0.32em] text-[#d46060] transition hover:bg-[#220d0d] disabled:opacity-40"
            >
              <DoorOpen className="h-3.5 w-3.5" />
              <span>{hubText.extract}</span>
            </button>

            {extractHint && (
              <p
                className={
                  extractAvailable
                    ? 'text-[9px] leading-relaxed text-[#6a8f6a]'
                    : 'text-[9px] leading-relaxed text-[#85776a]'
                }
              >
                {extractHint}
              </p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onReset}
          disabled={isLoading}
          title={isEndingScene ? undefined : game.returnHint}
          className="group inline-flex items-center gap-2 border border-[#241919] bg-[#0f0a0a]/80 px-4 py-2 text-[9px] uppercase tracking-[0.32em] text-[#6f6259] transition hover:border-[#4a2323] hover:text-[#d7c8bc] disabled:opacity-40"
        >
          <RotateCcw className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-rotate-180" />
          <span>{isEndingScene ? hubText.endingReturn : game.return}</span>
        </button>
      </div>
    </div>
  )
}
