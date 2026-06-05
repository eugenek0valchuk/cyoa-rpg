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
import { logChoice, logEnding, logArtifact, logSceneTransition } from '../debug'

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

  logChoice({
    scene: currentScene,
    choice,
    character: characterAfterTick,
  })

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

    logEnding(ending.title)

    return
  }

  if (revealedArtifact) {
    logArtifact(revealedArtifact.name)

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

    logSceneTransition({
      previousScene: currentScene,
      nextScene: queuedScene,
      history: sceneHistory,
    })

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
  })

  const visitedSceneIds = new Set(sceneHistory.map((entry) => entry.id))
  const wrapped = wrapSceneWithZoneBridge(
    resolvedScene,
    sceneHistory.length,
    sceneHistory.length + 1,
    characterAfterTick.corruption,
    visitedSceneIds,
    getRaidZone,
  )

  setCurrentScene(wrapped.scene)

  if (wrapped.queuedScene) {
    setQueuedScene?.(wrapped.queuedScene)
  } else {
    setQueuedScene?.(null)
  }

  logSceneTransition({
    previousScene: currentScene,
    nextScene: wrapped.scene,
    history: sceneHistory,
  })

  commitSceneTransition({
    currentScene,
    nextScene: wrapped.scene,
    pushSceneHistory,
    pushHistory,
  })
}
