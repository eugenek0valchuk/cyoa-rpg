import { contractById } from '@/locales/ru/contracts'

import { getSceneById } from './sceneRegistry'
import { applyChoiceEffects } from './applyChoiceEffects'
import { buildDirectorState } from './director'
import { getEnding } from './endings'
import { resolveNextScene } from './resolveNextScene'
import { createStaticScene } from './createStaticScene'
import { commitSceneTransition } from './commitSceneTransition'
import { applyRaidModifierTick } from './raidModifiers'
import type { RaidModifierId } from './raidModifiers'
import {
  isZoneBridgeScene,
  ZONE_BRIDGE_CONTINUE_ID,
  wrapSceneWithZoneBridge,
} from './zoneTransitions'
import { getRaidZone } from './zones'

import type {
  Artifact,
  Character,
  Choice,
  Scene,
  SceneHistoryEntry,
} from '../types/game'

interface HandleChoiceParams {
  currentScene: Scene
  choice: Choice
  character: Character
  sceneHistory: SceneHistoryEntry[]
  artifacts: Record<string, Artifact>
  raidModifierId?: RaidModifierId | null
  setCharacter: (character: Character) => void
  setCurrentScene: (scene: Scene) => void
  getQueuedScene?: () => Scene | null
  setQueuedScene?: (scene: Scene | null) => void
  pushSceneHistory: (scene: SceneHistoryEntry) => void
  pushHistory: (sceneId: string) => void
  revealArtifact: (artifact: Artifact) => Promise<void>
  journalEntries?: string[]
  roomMarks?: string[]
  contractId?: string | null
  encountersSeen?: string[]
  npcFlags?: string[]
  onEncounterSeen?: (sceneId: string) => void
}

export function isEncounterSceneId(sceneId: string): boolean {
  return sceneId.startsWith('encounter_')
}

function trackEncounterVisit(
  sceneId: string,
  encountersSeen: string[] | undefined,
  onEncounterSeen: ((sceneId: string) => void) | undefined,
) {
  if (!isEncounterSceneId(sceneId)) {
    return
  }

  if (encountersSeen?.includes(sceneId)) {
    return
  }

  onEncounterSeen?.(sceneId)
}

export async function handleGameChoice({
  currentScene,
  choice,
  character,
  sceneHistory,
  artifacts,
  raidModifierId,
  setCharacter,
  setCurrentScene,
  getQueuedScene,
  setQueuedScene,
  pushSceneHistory,
  pushHistory,
  revealArtifact,
  journalEntries = [],
  roomMarks = [],
  contractId = null,
  encountersSeen = [],
  npcFlags = [],
  onEncounterSeen,
}: HandleChoiceParams) {
  const { updatedCharacter, revealedArtifact } = applyChoiceEffects({
    character,
    choice,
    artifacts,
  })

  const skipModifierTick =
    isZoneBridgeScene(currentScene.id) &&
    choice.id === ZONE_BRIDGE_CONTINUE_ID

  const characterAfterTick =
    raidModifierId && !skipModifierTick
      ? applyRaidModifierTick(updatedCharacter, raidModifierId, roomMarks)
      : updatedCharacter

  setCharacter(characterAfterTick)

  const directorState = buildDirectorState(characterAfterTick, sceneHistory)

  const ending = getEnding(characterAfterTick, {
    historyLength: sceneHistory.length,
    phase: directorState.phase,
    forceEnding: directorState.forceEnding,
  })

  if (ending) {
    setQueuedScene?.(null)
    setCurrentScene(
      createStaticScene({
        id: ending.id,
        title: ending.title,
        description: ending.description,
      }),
    )

    return
  }

  if (revealedArtifact) {
    await revealArtifact(revealedArtifact)
  }

  const queuedScene = getQueuedScene?.() ?? null

  if (
    isZoneBridgeScene(currentScene.id) &&
    choice.id === ZONE_BRIDGE_CONTINUE_ID &&
    queuedScene
  ) {
    setQueuedScene?.(null)
    setCurrentScene(queuedScene)
    trackEncounterVisit(queuedScene.id, encountersSeen, onEncounterSeen)

    commitSceneTransition({
      currentScene,
      nextScene: queuedScene,
      pushSceneHistory,
      pushHistory,
    })

    return
  }

  const resolvedScene = resolveNextScene({
    currentScene,
    choice,
    character: characterAfterTick,
    sceneHistory,
    journalEntries,
    encountersSeen,
    npcFlags,
  })

  const visitedSceneIds = new Set(sceneHistory.map((entry) => entry.id))
  const contractVow = contractId ? contractById[contractId]?.vow : null
  const wrapped = wrapSceneWithZoneBridge(
    resolvedScene,
    sceneHistory.length,
    sceneHistory.length + 1,
    characterAfterTick.corruption,
    visitedSceneIds,
    getRaidZone,
    contractVow,
  )

  setCurrentScene(wrapped.scene)
  trackEncounterVisit(wrapped.scene.id, encountersSeen, onEncounterSeen)

  if (wrapped.queuedScene) {
    setQueuedScene?.(wrapped.queuedScene)
  } else {
    setQueuedScene?.(null)
  }

  commitSceneTransition({
    currentScene,
    nextScene: wrapped.scene,
    pushSceneHistory,
    pushHistory,
  })
}

interface NavigateRiskFailParams {
  currentScene: Scene
  choice: Choice
  character: Character
  sceneHistory: SceneHistoryEntry[]
  journalEntries?: string[]
  encountersSeen?: string[]
  setCurrentScene: (scene: Scene) => void
  pushSceneHistory: (scene: SceneHistoryEntry) => void
  pushHistory: (sceneId: string) => void
  onEncounterSeen?: (sceneId: string) => void
}

export function navigateRiskFailScene({
  currentScene,
  choice,
  character,
  sceneHistory,
  journalEntries = [],
  encountersSeen = [],
  setCurrentScene,
  pushSceneHistory,
  pushHistory,
  onEncounterSeen,
}: NavigateRiskFailParams): boolean {
  const failSceneId = choice.riskFailSceneId

  if (!failSceneId) {
    return false
  }

  const visitedSceneIds = new Set(sceneHistory.map((entry) => entry.id))
  const failScene = getSceneById(failSceneId, {
    character,
    journalEntries,
    visitedSceneIds,
  })

  if (!failScene) {
    return false
  }

  setCurrentScene(failScene)
  trackEncounterVisit(failScene.id, encountersSeen, onEncounterSeen)

  commitSceneTransition({
    currentScene,
    nextScene: failScene,
    pushSceneHistory,
    pushHistory,
  })

  return true
}
