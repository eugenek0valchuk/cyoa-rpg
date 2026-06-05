'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { GameIcon } from '@/components/game/ui/GameIcon'
import { getRaidZone } from '@/lib/game/zones'
import { t } from '@/lib/i18n'
import { useHubStore } from '@/lib/store/hubStore'

export default function RaidSummaryPage() {
  const router = useRouter()
  const summary = useHubStore((state) => state.pendingSummary)
  const clearSummary = useHubStore((state) => state.setPendingSummary)

  const { raidSummary: text, roomMarks } = t.hub
  const { ui: raidText } = t.raid

  useEffect(() => {
    if (!summary) {
      router.replace('/hub')
    }
  }, [summary, router])

  if (!summary) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-[#75685f]">
        …
      </main>
    )
  }

  const isExtracted = summary.outcome === 'extracted'
  const isEmergencyExtracted = summary.outcome === 'emergency_extracted'
  const isSuccessfulExtract = isExtracted || isEmergencyExtracted
  const isAbandoned = summary.outcome === 'abandoned'
  const loot = isSuccessfulExtract
    ? summary.gainedArtifacts
    : summary.lostArtifacts

  const title = isExtracted
    ? text.extractedTitle
    : isEmergencyExtracted
      ? text.emergencyExtractedTitle
      : isAbandoned
        ? text.abandonedTitle
        : text.failedTitle

  const subtitle = isExtracted
    ? text.extractedSubtitle
    : isEmergencyExtracted
      ? text.emergencyExtractedSubtitle
      : isAbandoned
        ? text.abandonedSubtitle
        : text.failedSubtitle

  const endZone = getRaidZone(summary.depth)

  const handleReturn = () => {
    clearSummary(null)
    router.push('/hub')
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-[#e7e2dc]">
      <img
        src="/main-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-black/80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(142,31,31,0.12),transparent_55%)]" />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
        <div className="text-center">
          <div
            className={`text-[12px] uppercase tracking-[0.2em] ${
              isSuccessfulExtract
                ? isEmergencyExtracted
                  ? 'text-[#a89060]'
                  : 'text-[#6a8f6a]'
                : isAbandoned
                  ? 'text-[#a08080]'
                  : 'text-[#d46060]'
            }`}
          >
            {title}
          </div>
          <h1 className="font-cinzel mt-3 text-4xl uppercase tracking-[0.1em] text-[#efe5dc] sm:text-5xl">
            {subtitle}
          </h1>
        </div>

        <div className="mt-12 space-y-4 border border-[#2b2320] bg-[#0d0909]/95 p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <SummaryRow label={text.depthReached} value={String(summary.depth)} />
            <SummaryRow
              label={text.zoneReached}
              value={raidText.zones[endZone]}
            />
            <SummaryRow
              label={text.bestDepth}
              value={String(summary.bestDepthAfter)}
            />
            <SummaryRow
              label={text.sanity}
              value={`${summary.sanityBefore} → ${summary.sanityAfter}`}
            />
            <SummaryRow
              label={text.roomLevel}
              value={String(summary.roomLevelAfter + 1)}
            />
            {isSuccessfulExtract &&
              summary.echoGain != null &&
              summary.echoGain > 0 && (
              <>
                <SummaryRow
                  label={text.echoGained}
                  value={`+${summary.echoGain}`}
                />
                <SummaryRow
                  label={text.echoTotal}
                  value={String(summary.echoAfter ?? 0)}
                />
              </>
            )}
            {summary.contractTitle && (
              <>
                <SummaryRow
                  label={text.contractTitle}
                  value={summary.contractTitle}
                />
                <SummaryRow
                  label={
                    summary.contractFulfilled
                      ? text.contractFulfilled
                      : text.contractBroken
                  }
                  value={
                    summary.contractFulfilled
                      ? summary.contractReward ?? '—'
                      : '—'
                  }
                />
                {summary.contractClaimPending && (
                  <div className="border border-[#2a3d2a] bg-[#0a120a]/60 px-4 py-3 sm:col-span-2">
                    <p className="text-[13px] leading-relaxed text-[#8fbc8f]">
                      {text.contractClaimHint}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="border-t border-[#241919] pt-5">
            <div className="text-[13px] uppercase tracking-[0.12em] text-[#75685f]">
              {isSuccessfulExtract ? text.gained : text.lost}
            </div>
            {loot.length === 0 ? (
              <p className="mt-3 text-[15px] text-[#75685f]">{text.noLoot}</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {loot.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 border border-[#2b2320] bg-black/40 px-4 py-3"
                  >
                    <GameIcon type="artifact" size={36} />
                    <span className="text-[15px] text-[#d8c9be]">{item.name}</span>
                  </li>
                ))}
              </ul>
            )}
            {isEmergencyExtracted && summary.lostArtifacts.length > 0 && (
              <>
                <div className="mt-5 text-[13px] uppercase tracking-[0.12em] text-[#75685f]">
                  {text.lost}
                </div>
                <ul className="mt-3 space-y-2">
                  {summary.lostArtifacts.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 border border-[#3a2a1a] bg-black/40 px-4 py-3"
                    >
                      <GameIcon type="artifact" size={36} />
                      <span className="text-[15px] text-[#a89070]">
                        {item.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="border-t border-[#241919] pt-5">
            <div className="text-[13px] uppercase tracking-[0.12em] text-[#75685f]">
              {text.newMarks}
            </div>
            {summary.newMarks.length === 0 ? (
              <p className="mt-3 text-[15px] text-[#75685f]">{text.noMarks}</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {summary.newMarks.map((mark) => (
                  <li
                    key={mark}
                    className="flex items-center gap-2 text-[14px] text-[#9d8d82]"
                  >
                    <GameIcon type="flag" size={24} />
                    {roomMarks[mark] ?? mark}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          type="button"
          data-testid="raid-summary-return"
          onClick={handleReturn}
          className="font-cinzel mt-10 w-full border-2 border-[#5c1f1f] bg-[#160909] px-6 py-4 text-lg uppercase tracking-[0.15em] text-[#d46060] transition hover:bg-[#220d0d]"
        >
          {text.returnToChamber}
        </button>
      </section>
    </main>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#2b2320] bg-black/30 px-4 py-3">
      <div className="text-[12px] text-[#75685f]">{label}</div>
      <div className="font-cinzel mt-1 text-xl text-[#d6cdc3]">{value}</div>
    </div>
  )
}
