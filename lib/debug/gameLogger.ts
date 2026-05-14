import type { Character, Choice, Scene, SceneHistoryEntry } from '../types/game'

interface LogChoicePayload {
  scene: Scene
  choice: Choice
  character: Character
}

interface LogScenePayload {
  previousScene: Scene
  nextScene: Scene
  history: SceneHistoryEntry[]
}

function appendLog(type: string, payload: unknown) {
  if (typeof window === 'undefined') return

  const existing = localStorage.getItem('game-debug-log') || ''

  const timestamp = new Date().toISOString()

  const block = [
    '\n================================',
    `[${timestamp}] ${type}`,
    '================================',
    JSON.stringify(payload, null, 2),
    '',
  ].join('\n')

  localStorage.setItem('game-debug-log', existing + block)
}

export function downloadLogs() {
  if (typeof window === 'undefined') return

  const logs = localStorage.getItem('game-debug-log') || ''

  const blob = new Blob([logs], {
    type: 'text/plain',
  })

  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')

  a.href = url
  a.download = 'game-debug.log'

  a.click()

  URL.revokeObjectURL(url)
}

export function clearLogs() {
  localStorage.removeItem('game-debug-log')
}

export function logChoice({ scene, choice, character }: LogChoicePayload) {
  const payload = {
    scene: scene.title,

    choice: choice.text,

    stats: {
      sanity: character.sanity,
      corruption: character.corruption,
    },

    inventory: character.inventory.map((item) => item.name),

    flags: character.flags,

    effects: choice.effects,

    requirements: choice.requirements,
  }

  console.group('%cCHOICE', 'color:#c084fc')

  console.log(payload)

  console.groupEnd()

  appendLog('CHOICE', payload)
}

export function logSceneTransition({
  previousScene,
  nextScene,
  history,
}: LogScenePayload) {
  const payload = {
    from: previousScene.title,

    to: nextScene.title,

    nextSceneId: nextScene.id,

    preview: nextScene.description.slice(0, 220),

    options: nextScene.options.map((option, index) => ({
      index: index + 1,
      text: option.text,
    })),

    historyLength: history.length,
  }

  console.group('%cSCENE TRANSITION', 'color:#f87171')

  console.log(payload)

  console.groupEnd()

  appendLog('SCENE TRANSITION', payload)
}

export function logEnding(title: string) {
  console.group('%cENDING', 'color:#ef4444')

  console.log(title)

  console.groupEnd()

  appendLog('ENDING', { title })
}

export function logArtifact(name: string) {
  console.group('%cARTIFACT', 'color:#facc15')

  console.log(name)

  console.groupEnd()

  appendLog('ARTIFACT', { name })
}
