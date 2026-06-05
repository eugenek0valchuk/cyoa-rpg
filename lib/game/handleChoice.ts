import { applyChoiceEffects } from './applyChoiceEffects'
import { buildDirectorState } from './director'
import { getEnding } from './endings'
import { resolveNextScene } from './resolveNextScene'
import { createStaticScene } from './createStaticScene'
import { commitSceneTransition } from './commitSceneTransition'
import { applyRaidModifierTick } from './raidModifiers'
import type { RaidModifierId } from './raidModifiers'

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
  pushSceneHistory: (scene: SceneHistoryEntry) => void
  pushHistory: (sceneId: string) => void
  revealArtifact: (artifact: Artifact) => Promise<void>
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
  pushSceneHistory,
  pushHistory,
  revealArtifact,
}: HandleChoiceParams) {
  const { updatedCharacter, revealedArtifact } = applyChoiceEffects({
    character,
    choice,
    artifacts,
  })

  setCharacter(updatedCharacter)

  logChoice({
    scene: currentScene,
    choice,
    character: updatedCharacter,
  })

  const directorState = buildDirectorState(updatedCharacter, sceneHistory)

  const ending = getEnding(updatedCharacter, {
    historyLength: sceneHistory.length,
    phase: directorState.phase,
    forceEnding: directorState.forceEnding,
  })

  if (ending) {
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

  const nextScene = resolveNextScene({
    currentScene,
    choice,
    character: updatedCharacter,
    sceneHistory,
  })

  setCurrentScene(nextScene)

  logSceneTransition({
    previousScene: currentScene,
    nextScene,
    history: sceneHistory,
  })

  commitSceneTransition({
    currentScene,
    nextScene,
    pushSceneHistory,
    pushHistory,
  })

  if (raidModifierId) {
    setCharacter(applyRaidModifierTick(updatedCharacter, raidModifierId))
  }
}
