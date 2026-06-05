'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { HubChronicleMagazine } from '@/components/hub/HubChronicleMagazine'
import { HubBottomBar } from '@/components/hub/HubBottomBar'
import { HubOnboardingBanner } from '@/components/hub/HubOnboardingBanner'
import { HubMerchantOverlay } from '@/components/hub/HubMerchantOverlay'
import { HubScribeOverlay } from '@/components/hub/HubScribeOverlay'
import { ThresholdContractPicker } from '@/components/hub/ThresholdContractPicker'
import { journalCatalog } from '@/locales/ru/journal'
import { contractById, scribeUi } from '@/locales/ru/contracts'
import {
  RoomHotspotLayer,
  type HotspotBadges,
} from '@/components/hub/RoomHotspotLayer'
import { VesselStats } from '@/components/hub/VesselStats'
import { ArtifactDetailModal } from '@/components/game/ArtifactDetailModal'
import { GameIcon } from '@/components/game/ui/GameIcon'
import { GothicModal } from '@/components/ui/GothicModal'
import { saveCurrentGameState, getActiveSlotId } from '@/lib/persistence/saveStorage'
import { getRaidStartScene, startRaidFromHub } from '@/lib/game/raid'
import {
  getRaidModifier,
  pickRaidModifier,
  type RaidModifierId,
} from '@/lib/game/raidModifiers'
import {
  applyChamberRest,
  applyRaidStartSanity,
  canAffordEchoReroll,
  canChamberRest,
  ECHO_REROLL_COST,
  getRaidStartSanityDelta,
  hasFreeModifierReroll,
  hasHarshModifierPool,
  markChamberRestUsed,
  spendEcho,
} from '@/lib/game/hubMeta'
import {
  claimPendingContract,
  isScribeUnlocked,
  pickOfferedContracts,
} from '@/lib/game/contracts'
import { exitToMainMenu, useAutoSave } from '@/hooks/useAutoSave'
import { isHubMerchantUnlocked } from '@/lib/game/merchant'
import { roomHotspotLayouts, type HotspotId } from '@/lib/hub/roomHotspots'
import { t } from '@/lib/i18n'
import { useCharacterStore } from '@/lib/store/characterStore'
import { useGameStore } from '@/lib/store/gameStore'
import { useHubStore } from '@/lib/store/hubStore'
import type { Artifact } from '@/lib/types/game'

type HubModalId = HotspotId | 'merchant'

function renderHubEmphasis(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-medium text-[#e7ded7]">
        {part}
      </strong>
    ) : (
      part
    ),
  )
}

export default function HubPage() {
  const router = useRouter()
  useAutoSave()

  const { ui: hubText, rooms } = t.hub
  const hotspots = hubText.hotspots

  const character = useCharacterStore((state) => state.character)
  const setCharacter = useCharacterStore((state) => state.setCharacter)

  const hub = useHubStore((state) => state.hub)
  const raid = useHubStore((state) => state.raid)
  const pendingSummary = useHubStore((state) => state.pendingSummary)
  const setHub = useHubStore((state) => state.setHub)
  const setRaid = useHubStore((state) => state.setRaid)

  const resetGame = useGameStore((state) => state.resetGame)
  const setCurrentScene = useGameStore((state) => state.setCurrentScene)

  const [activeModal, setActiveModal] = useState<HubModalId | null>(null)
  const [merchantToast, setMerchantToast] = useState<string | null>(null)
  const [chronicleTab, setChronicleTab] = useState<
    'chamber' | 'magazine' | 'marks' | 'lore' | undefined
  >(undefined)
  const [selectedLoadout, setSelectedLoadout] = useState<string[]>([])
  const [pendingModifier, setPendingModifier] = useState<RaidModifierId>(() =>
    pickRaidModifier(),
  )
  const [freeRerollUsed, setFreeRerollUsed] = useState(false)
  const [selectedContractId, setSelectedContractId] = useState<string | null>(
    null,
  )
  const [claimingContract, setClaimingContract] = useState(false)
  const [claimToast, setClaimToast] = useState<string | null>(null)
  const [inspectArtifact, setInspectArtifact] = useState<Artifact | null>(null)

  const room = character ? rooms[character.origin] : null
  const hotspotRegions = character
    ? roomHotspotLayouts[character.origin]
    : []

  const scribeUnlocked = hub ? isScribeUnlocked(hub) : false
  const merchantUnlocked = hub ? isHubMerchantUnlocked(hub) : false

  const offeredContracts = useMemo(
    () => (hub ? pickOfferedContracts(hub) : []),
    [hub],
  )
  const thresholdContracts = useMemo(() => {
    if (!hub) {
      return []
    }

    if (scribeUnlocked) {
      return offeredContracts
    }

    return offeredContracts
      .filter((contract) => contract.id === 'vow_first_threshold')
      .slice(0, 1)
  }, [hub, offeredContracts, scribeUnlocked])
  const isFirstBriefing =
    hub != null && hub.totalExtractions === 0 && hub.totalRaids === 0
  const visibleHotspots = useMemo(
    () =>
      hotspotRegions.filter(
        (spot) => spot.id !== 'scribe' || scribeUnlocked,
      ),
    [hotspotRegions, scribeUnlocked],
  )
  const selectedContract = selectedContractId
    ? contractById[selectedContractId]
    : null

  useEffect(() => {
    if (hub?.pendingContractClaim) {
      setActiveModal('scribe')
    }
  }, [hub?.pendingContractClaim])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (params.get('chronicle') === 'chamber') {
      setChronicleTab('chamber')
      setActiveModal('chronicle')
    }
  }, [])

  useEffect(() => {
    if (activeModal === 'threshold' && hub) {
      setPendingModifier(
        pickRaidModifier(Date.now(), {
          harshOnly: hasHarshModifierPool(hub.roomMarks),
        }),
      )
      setFreeRerollUsed(false)
    }
  }, [activeModal, hub])

  useEffect(() => {
    if (!character || !hub) {
      router.push('/')
      return
    }

    if (pendingSummary) {
      router.push('/raid-summary')
      return
    }

    if (raid?.active) {
      router.push('/game')
    }
  }, [character, hub, pendingSummary, raid, router])

  const toggleLoadout = (artifactId: string) => {
    if (!hub) {
      return
    }

    setSelectedLoadout((current) => {
      if (current.includes(artifactId)) {
        return current.filter((id) => id !== artifactId)
      }

      if (current.length >= hub.loadoutSlots) {
        return current
      }

      return [...current, artifactId]
    })
  }

  const loadoutItems = useMemo(() => {
    if (!hub) {
      return [] as Artifact[]
    }

    return hub.stash.filter((item) => selectedLoadout.includes(item.id))
  }, [hub, selectedLoadout])

  const handleExitToMenu = async () => {
    await exitToMainMenu()
    router.push('/')
  }

  const handleClaimContract = async () => {
    if (!hub?.pendingContractClaim || claimingContract) {
      return
    }

    setClaimingContract(true)

    const { hub: nextHub, rewardSummary } = claimPendingContract(hub)
    setHub(nextHub)
    setClaimToast(
      rewardSummary
        ? `${scribeUi.claimDone} ${rewardSummary}`
        : scribeUi.claimDone,
    )

    if (character) {
      const gameState = useGameStore.getState()
      await saveCurrentGameState(getActiveSlotId(), {
        character,
        currentScene: gameState.currentScene,
        history: gameState.history,
        sceneHistory: gameState.sceneHistory,
        hub: nextHub,
        raid,
      })
    }

    setClaimingContract(false)
    window.setTimeout(() => setClaimToast(null), 4000)
  }

  const handleRerollModifier = () => {
    if (!hub) {
      return
    }

    const harshOnly = hasHarshModifierPool(hub.roomMarks)
    const roll = () =>
      setPendingModifier(
        pickRaidModifier(Date.now(), { harshOnly }),
      )

    if (hasFreeModifierReroll(hub) && !freeRerollUsed) {
      setFreeRerollUsed(true)
      roll()
      return
    }

    const spent = spendEcho(hub, ECHO_REROLL_COST)

    if (!spent) {
      return
    }

    setHub(spent)
    roll()
  }

  const handleBeginRaid = async () => {
    if (!character || !hub) {
      return
    }

    const started = startRaidFromHub(
      character,
      hub,
      loadoutItems,
      pendingModifier,
      selectedContractId,
    )

    setCharacter(started.character)
    setHub(started.hub)
    setRaid(started.raid)
    setActiveModal(null)
    setSelectedContractId(null)

    resetGame()
    const startScene = getRaidStartScene(
      started.character,
      started.hub.journalEntries ?? [],
    )
    setCurrentScene(startScene)

    await saveCurrentGameState(getActiveSlotId(), {
      character: started.character,
      currentScene: startScene,
      history: [],
      sceneHistory: [],
      hub: started.hub,
      raid: started.raid,
    })

    router.push('/game')
  }

  if (!character || !hub || !room) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-[14px] text-[#75685f]">
        {hubText.eyebrow}
      </main>
    )
  }

  const evolvedText = room.evolved[hub.roomLevel] ?? room.description
  const pendingModifierDef = getRaidModifier(pendingModifier)
  const { ui: raidText } = t.raid
  const { roomMarkEffects } = t.hub
  const raidStartSanity = applyRaidStartSanity(character.sanity, hub.roomMarks)
  const sanityMarkDelta = getRaidStartSanityDelta(hub.roomMarks)
  const lowSanityWarning =
    raidStartSanity <= 18
      ? raidText.prepareLowSanityWarn.replace(
          '{sanity}',
          String(raidStartSanity),
        )
      : null
  const chamberRestAvailable = canChamberRest(hub, character)

  const handleChamberRest = () => {
    if (!chamberRestAvailable) {
      return
    }

    setCharacter(applyChamberRest(character))
    setHub(markChamberRestUsed(hub))
  }
  const canRerollFree = hasFreeModifierReroll(hub) && !freeRerollUsed
  const canRerollEcho = canAffordEchoReroll(hub)
  const rerollLabel = canRerollFree
    ? raidText.prepareModifierRollFree
    : canRerollEcho
      ? raidText.prepareModifierRollEcho.replace(
          '{cost}',
          String(ECHO_REROLL_COST),
        )
      : raidText.prepareModifierRoll

  const hotspotBadges: HotspotBadges = {
    stash: hub.stash.length > 0 ? String(hub.stash.length) : undefined,
    vessel: String(character.sanity),
    chronicle:
      (hub.journalEntries?.length ?? 0) > 0
        ? `${hub.journalEntries.length}/${journalCatalog.length}`
        : hub.roomMarks.length > 0
          ? String(hub.roomMarks.length)
          : undefined,
    threshold: selectedContract ? '◆' : '↓',
    scribe: hub.pendingContractClaim
      ? '!'
      : selectedContract
        ? '◆'
        : scribeUnlocked
          ? '?'
          : undefined,
  }

  const closeModal = () => {
    setActiveModal(null)
    setChronicleTab(undefined)
  }

  const openChronicle = (tab?: 'chamber' | 'magazine' | 'marks' | 'lore') => {
    setChronicleTab(tab)
    setActiveModal('chronicle')
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-[#e7e2dc]">
      <img
        src={room.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="pointer-events-none absolute inset-0 bg-black/40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />

      <RoomHotspotLayer
        hotspots={visibleHotspots}
        labels={hotspots}
        badges={hotspotBadges}
        origin={character.origin}
        activeId={activeModal === 'merchant' ? null : activeModal}
        onSelect={(id) => {
          if (id === 'chronicle') {
            openChronicle()
            return
          }

          setActiveModal((current) => (current === id ? null : id))
        }}
      />

      <header className="absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-black/85 to-transparent px-5 pb-8 pt-6 sm:px-8">
        <HubOnboardingBanner
          suppressed={activeModal !== null || (hub?.totalRaids ?? 0) > 0}
        />
        {chamberRestAvailable && activeModal === null && (
          <div className="mb-4 border border-[#3a4a3a]/80 bg-[#0d120d]/70 px-4 py-3 text-[13px] leading-relaxed text-[#9aab92]">
            {renderHubEmphasis(hubText.chamberRestBanner)}
            <button
              type="button"
              onClick={() => setActiveModal('vessel')}
              className="mt-2 block text-[11px] uppercase tracking-[0.12em] text-[#b4c27d] hover:underline"
            >
              {hubText.chamberRestAction}
            </button>
          </div>
        )}
        {hub.roomMarks.includes('failure_stain') && activeModal === null && (
          <div className="mb-4 border border-[#4a2323] bg-[#160909]/70 px-4 py-3 text-[13px] leading-relaxed text-[#c09090]">
            {renderHubEmphasis(hubText.failureStainBanner)}
            <button
              type="button"
              onClick={() => openChronicle('marks')}
              className="mt-2 block text-[11px] uppercase tracking-[0.12em] text-[#d46060] hover:underline"
            >
              {hubText.marksHint}
            </button>
          </div>
        )}
        {hub.roomMarks.length > 0 && !hub.roomMarks.includes('failure_stain') && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.14em] text-[#75685f]">
              {hubText.marks}:
            </span>
            {hub.roomMarks.map((mark) => (
              <button
                key={mark}
                type="button"
                onClick={() => openChronicle('marks')}
                className="border border-[#4a2323]/70 bg-[#160909]/50 px-2.5 py-1 text-[11px] text-[#c09090] transition hover:border-[#8e1f1f]"
                title={roomMarkEffects[mark]}
              >
                {t.hub.roomMarks[mark] ?? mark}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[12px] uppercase tracking-[0.15em] text-[#85776a]">
              {hubText.eyebrow}
            </div>
            <h1 className="font-cinzel mt-1 text-2xl uppercase tracking-[0.1em] text-[#efe5dc] sm:text-4xl">
              {room.title}
            </h1>
            <p className="mt-1 max-w-lg text-[14px] leading-relaxed text-[#b8a99e] sm:text-[15px]">
              {room.subtitle}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] text-[#85776a]">
              <span>
                {hubText.echo}:{' '}
                <span className="font-cinzel text-[#d8c9be]">{hub.echo ?? 0}</span>
              </span>
              <span>
                {hubText.roomLevel}:{' '}
                <span className="font-cinzel text-[#d8c9be]">
                  {hub.roomLevel + 1}
                </span>
              </span>
              {(hub.totalRaids === 0 && hub.totalExtractions === 0) && (
                <span className="text-[#6f6259]">{hubText.hotspotHint}</span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleExitToMenu}
            title={hubText.exitToMenuHint}
            className="shrink-0 border border-[#2b2320] px-3 py-2 text-[10px] uppercase tracking-[0.15em] text-[#75685f] transition hover:border-[#5c1f1f] hover:text-[#d46060] sm:px-4 sm:text-[11px]"
          >
            {hubText.exitToMenu}
          </button>
        </div>
      </header>

      <HubBottomBar
        origin={character.origin}
        showScribe={scribeUnlocked}
        showMerchant={merchantUnlocked}
        labels={{
          stash: hubText.bottomStash,
          vessel: hubText.bottomVessel,
          chronicle: hubText.bottomChronicle,
          scribe: hubText.bottomScribe,
          merchant: hubText.bottomMerchant,
          descend: hubText.bottomDescend,
          archives: hubText.bottomArchives,
        }}
        activeId={activeModal}
        onSelect={(id) => {
          if (id === 'chronicle') {
            openChronicle()
            return
          }

          setActiveModal(id)
        }}
        modalOpen={activeModal !== null}
        onArchives={() => router.push('/archives')}
      />

      <HubMerchantOverlay
        open={activeModal === 'merchant'}
        unlocked={merchantUnlocked}
        hub={hub}
        onClose={closeModal}
        onHubChange={setHub}
        toast={merchantToast}
        onToast={(message) => {
          setMerchantToast(message)
          window.setTimeout(() => setMerchantToast(null), 3500)
        }}
      />

      <GothicModal
        open={activeModal === 'vessel'}
        onClose={closeModal}
        icon={
          character.origin === 'hollow'
            ? 'hollow'
            : character.origin === 'heretic'
              ? 'heretic'
              : 'witness'
        }
        title={hotspots.vessel.label}
        subtitle={hotspots.vessel.hint}
        footer={
          <p className="text-[13px] leading-relaxed text-[#75685f]">
            {character.name} · {hubText.statTips.strength.split('—')[0]?.trim()}
          </p>
        }
      >
        <VesselStats
          character={character}
          roomMarks={hub.roomMarks}
          canChamberRest={chamberRestAvailable}
          chamberRestUsed={Boolean(hub.chamberRestUsed)}
          onChamberRest={handleChamberRest}
        />
      </GothicModal>

      <GothicModal
        open={activeModal === 'stash'}
        onClose={closeModal}
        icon="artifact"
        title={hotspots.stash.label}
        subtitle={hotspots.stash.hint}
        maxWidth="lg"
      >
        {hub.stash.length === 0 ? (
          <p className="text-[15px] text-[#75685f]">{hubText.emptyStash}</p>
        ) : (
          <ul className="space-y-2">
            {hub.stash.map((artifact) => (
              <li key={artifact.id}>
                <button
                  type="button"
                  onClick={() => setInspectArtifact(artifact)}
                  className="flex w-full items-start gap-3 border border-[#2b2320] bg-black/30 px-4 py-3 text-left transition hover:border-[#5c3a2a] hover:bg-[#120c0c]"
                >
                  <GameIcon type="artifact" size={44} />
                  <div className="min-w-0">
                    <div className="text-[15px] text-[#d8c9be]">{artifact.name}</div>
                    <div className="mt-1 text-[13px] leading-relaxed text-[#85776a]">
                      {artifact.description}
                    </div>
                    <div className="mt-2 text-[11px] uppercase tracking-[0.1em] text-[#6f6259]">
                      {artifact.rarity}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </GothicModal>

      <GothicModal
        open={activeModal === 'chronicle'}
        onClose={closeModal}
        icon="flag"
        title={hotspots.chronicle.label}
        subtitle={hotspots.chronicle.hint}
        maxWidth="xl"
      >
        <HubChronicleMagazine
          hub={hub}
          vesselName={character.name}
          evolvedText={evolvedText}
          roomTitle={room.title}
          initialTab={chronicleTab}
        />
      </GothicModal>

      <HubScribeOverlay
        open={activeModal === 'scribe'}
        unlocked={scribeUnlocked}
        hub={hub}
        offered={offeredContracts}
        selectedContractId={selectedContractId}
        selectedContractTitle={selectedContract?.title}
        onSelectContract={setSelectedContractId}
        onClose={closeModal}
        claimToast={claimToast}
        claimingContract={claimingContract}
        onClaimContract={handleClaimContract}
      />

      <GothicModal
        open={activeModal === 'threshold'}
        onClose={closeModal}
        icon="flag"
        title={raidText.prepareTitle}
        subtitle={
          isFirstBriefing
            ? raidText.prepareSubtitleFirst
            : raidText.prepareSubtitle
        }
        maxWidth="lg"
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-[#85776a]">
              {hubText.loadoutHint.replace('{count}', String(hub.loadoutSlots))}
            </p>
            <button
              type="button"
              data-testid="hub-begin-raid"
              onClick={handleBeginRaid}
              className="font-cinzel shrink-0 border-2 border-[#5c1f1f] bg-[#160909] px-8 py-3 text-sm uppercase tracking-[0.15em] text-[#d46060] transition hover:bg-[#220d0d]"
            >
              {hubText.beginRaid}
            </button>
          </div>
        }
      >
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border border-[#2b2320] bg-black/30 px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.12em] text-[#75685f]">
                {raidText.prepareVesselTitle}
              </div>
              <div className="mt-2 font-cinzel text-xl text-[#efe5dc]">
                {character.name}
              </div>
              <div className="mt-2 flex items-center gap-2 text-[13px] text-[#9d8d82]">
                <GameIcon type="sanity" size={28} />
                {raidText.prepareSanity}: {character.sanity}
                {sanityMarkDelta !== 0 && (
                  <span className="text-[#d46060]">
                    → {raidStartSanity} ({raidText.prepareStartSanity})
                  </span>
                )}
              </div>
              <div className="mt-2 text-[11px] text-[#75685f]">
                {raidText.prepareLoadoutSlots}: {hub.loadoutSlots}
              </div>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-[#75685f]">
                <GameIcon type="artifact" size={24} />
                {raidText.prepareEcho}: {hub.echo ?? 0}
              </div>
            </div>

            <div className="border border-[#4a2323] bg-[#160909]/40 px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div className="text-[11px] uppercase tracking-[0.12em] text-[#d46060]">
                  {raidText.modifierLabel}
                </div>
                <button
                  type="button"
                  onClick={handleRerollModifier}
                  disabled={!canRerollFree && !canRerollEcho}
                  className="text-[10px] uppercase tracking-[0.12em] text-[#85776a] transition hover:text-[#d46060] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {rerollLabel}
                </button>
              </div>
              {pendingModifierDef && (
                <>
                  <div className="mt-2 font-cinzel text-lg text-[#efe5dc]">
                    {pendingModifierDef.name}
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#9d8d82]">
                    {pendingModifierDef.description}
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.1em] text-[#75685f]">
                    {pendingModifierDef.hint}
                  </p>
                </>
              )}
            </div>
          </div>

          {lowSanityWarning && (
            <div className="border border-[#4a2323] bg-[#160909]/50 px-4 py-3 text-[13px] leading-relaxed text-[#d46060]">
              {lowSanityWarning}
            </div>
          )}

          <ThresholdContractPicker
            offered={thresholdContracts}
            selectedContractId={selectedContractId}
            onSelect={setSelectedContractId}
            compact={!scribeUnlocked}
          />

          {scribeUnlocked && (
            <p className="text-[12px] text-[#75685f]">
              {scribeUi.thresholdHint} — больше обетов у {hotspots.scribe.label}
            </p>
          )}

          {hub.roomMarks.length > 0 && (
            <div className="border border-[#2b2320] bg-black/30 px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.12em] text-[#75685f]">
                {raidText.prepareMarkEffects}
              </div>
              <ul className="mt-3 space-y-2">
                {hub.roomMarks.map((mark) => (
                  <li key={mark} className="text-[13px] text-[#9d8d82]">
                    <span className="text-[#d8c9be]">
                      {t.hub.roomMarks[mark] ?? mark}
                    </span>
                    {roomMarkEffects[mark] && (
                      <span className="text-[#85776a]">
                        {' '}
                        — {roomMarkEffects[mark]}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <div className="text-[11px] uppercase tracking-[0.12em] text-[#75685f]">
              {raidText.prepareRulesTitle}
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-[#9d8d82]">
              {hubText.extractionBody}
            </p>
          </div>

          <div>
            <div className="text-[13px] uppercase tracking-[0.12em] text-[#75685f]">
              {raidText.prepareLoadoutTitle}
            </div>

            {hub.stash.length === 0 ? (
              <p className="mt-3 text-[15px] text-[#75685f]">{hubText.emptyStash}</p>
            ) : (
              <div className="mt-3 space-y-2">
                {hub.stash.map((artifact) => {
                  const selected = selectedLoadout.includes(artifact.id)
                  const slotsFull =
                    !selected && selectedLoadout.length >= hub.loadoutSlots

                  return (
                    <div
                      key={artifact.id}
                      className={`flex items-center gap-2 border px-2 py-2 transition disabled:opacity-40 ${
                        selected
                          ? 'border-[#8e1f1f] bg-[#160909]'
                          : 'border-[#2b2320] bg-black/30'
                      }`}
                    >
                      <button
                        type="button"
                        disabled={slotsFull}
                        onClick={() => toggleLoadout(artifact.id)}
                        title={artifact.description}
                        className="flex min-w-0 flex-1 items-center gap-3 px-2 py-1 text-left transition hover:opacity-90 disabled:opacity-40"
                      >
                        <GameIcon type="artifact" size={40} />
                        <span className="text-[15px] text-[#d8c9be]">{artifact.name}</span>
                        {selected && (
                          <span className="ml-auto text-[11px] uppercase text-[#d46060]">
                            ✓
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setInspectArtifact(artifact)}
                        className="shrink-0 border border-[#2b2320] px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-[#85776a] transition hover:border-[#5c3a2a] hover:text-[#d8c9be]"
                        title={t.ui.artifactDetail.inspectHint}
                      >
                        …
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </GothicModal>

      <ArtifactDetailModal
        artifact={inspectArtifact}
        open={inspectArtifact != null}
        onClose={() => setInspectArtifact(null)}
        mode="inspect"
      />
    </main>
  )
}
