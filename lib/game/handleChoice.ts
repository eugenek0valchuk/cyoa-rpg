import { applyChoiceEffects } from './applyChoiceEffects'
import { resolveEnding } from './resolveEnding'
import { resolveNextScene } from './resolveNextScene'
import { createStaticScene } from './createStaticScene'
import { commitSceneTransition } from './commitSceneTransition'

import type {
  Artifact,
  Character,
  Choice,
  Scene,
  SceneMemory,
} from '../types/game'
import {
  logArtifact,
  logChoice,
  logEnding,
  logSceneTransition,
} from './debugLog'

interface HandleChoiceParams {
  currentScene: Scene

  choice: Choice

  character: Character

  sceneHistory: SceneMemory[]

  artifacts: Record<string, Artifact>

  generateScene: (
    currentScene: Scene,
    choice: Choice,
    character: Character,
    sceneHistory: SceneMemory[],
  ) => Promise<Scene>

  updateSanity: (amount: number) => void

  updateCorruption: (amount: number) => void

  addFlag: (flag: string) => void

  addArtifact: (artifact: Artifact) => void

  setCurrentScene: (scene: Scene) => void

  pushSceneHistory: (scene: SceneMemory) => void

  pushHistory: (sceneId: string) => void

  revealArtifact: (artifact: Artifact) => Promise<void>
}

export async function handleGameChoice({
  currentScene,
  choice,
  character,
  sceneHistory,
  artifacts,
  generateScene,
  updateSanity,
  updateCorruption,
  addFlag,
  addArtifact,
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

  logChoice({
    scene: currentScene,
    choice,
    character,
  })

  const ending = resolveEnding(
    updatedCharacter.sanity,
    updatedCharacter.corruption,
  )

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

  if (choice.effects?.sanity) {
    updateSanity(choice.effects.sanity)
  }

  if (choice.effects?.corruption) {
    updateCorruption(choice.effects.corruption)
  }

  if (choice.effects?.addFlag) {
    addFlag(choice.effects.addFlag)
  }

  if (revealedArtifact) {
    addArtifact(revealedArtifact)

    logArtifact(revealedArtifact.name)

    await revealArtifact(revealedArtifact)
  }

  const nextScene = await resolveNextScene({
    currentScene,
    choice,
    character: updatedCharacter,
    sceneHistory,
    generateScene,
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
}
