import type { Character, Choice, Scene, SceneMemory } from '../types/game'

interface LogChoicePayload {
  scene: Scene
  choice: Choice
  character: Character
}

interface LogScenePayload {
  previousScene: Scene
  nextScene: Scene
  history: SceneMemory[]
}

export function logChoice({ scene, choice, character }: LogChoicePayload) {
  console.group('%cCHOICE', 'color:#c084fc')

  console.log('Scene:', scene.title)
  console.log('Choice:', choice.text)

  console.table({
    sanity: character.sanity,
    corruption: character.corruption,
    inventory: character.inventory.length,
    flags: character.flags.join(', '),
  })

  console.log('Effects:', choice.effects)
  console.log('Requirements:', choice.requirements)

  console.groupEnd()
}

export function logSceneTransition({
  previousScene,
  nextScene,
  history,
}: LogScenePayload) {
  console.group('%cSCENE TRANSITION', 'color:#f87171')

  console.log('FROM:', previousScene.title)
  console.log('TO:', nextScene.title)

  console.log('Next Scene ID:', nextScene.id)

  console.log('Description Preview:')
  console.log(nextScene.description.slice(0, 220))

  console.log('Options:')

  nextScene.options.forEach((option, index) => {
    console.log(`${index + 1}. ${option.text}`)
  })

  console.log('History Length:', history.length)

  console.groupEnd()
}

export function logEnding(title: string) {
  console.group('%cENDING', 'color:#ef4444')

  console.log('Ending Triggered:', title)

  console.groupEnd()
}

export function logArtifact(name: string) {
  console.group('%cARTIFACT', 'color:#facc15')

  console.log('Artifact Acquired:', name)

  console.groupEnd()
}
