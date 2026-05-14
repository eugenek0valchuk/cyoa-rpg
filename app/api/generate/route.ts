import { NextResponse } from 'next/server'

import { parseScene } from '@/lib/game/parseScene'
import { buildScenePrompt } from '@/lib/game/promptBuilder'
import { validateScene } from '@/lib/game/validateScene'
import { buildDirectorState } from '@/lib/game/director'
import { detectSceneLoop } from '@/lib/game/loopDetection'
import { fetchWithRetry } from '@/lib/game/fetchWithRetry'
import type { Character, Scene, SceneHistoryEntry } from '@/lib/types/game'

interface OllamaResponse {
  response: string
}

interface GenerateRequest {
  currentScene: Scene
  choice: { id: string; text: string }
  character: Character
  sceneHistory: SceneHistoryEntry[]
}

function getFallbackScene(choiceText: string): Scene {
  return {
    id: 'fallback_scene',
    title: 'The Path Below',
    description:
      `You chose "${choiceText}". ` +
      'The silence beneath the cathedral deepens as unseen bells echo through stone.',
    options: [
      {
        id: 'continue_forward',
        text: 'Descend deeper into the abyss',
        effects: { sanity: -5 },
      },
      {
        id: 'observe_shadows',
        text: 'Remain still and observe the darkness',
        effects: {},
      },
    ],
  }
}

async function fetchSceneFromOllama(prompt: string): Promise<Scene> {
  const data = await fetchWithRetry<OllamaResponse>(
    'http://localhost:11434/api/generate',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2:3b',
        prompt,
        stream: false,
        format: 'json',
        options: {
          temperature: 0.7,
          top_p: 0.9,
          repeat_penalty: 1.15,
        },
      }),
    },
  )

  return parseScene(data.response)
}

export async function POST(request: Request) {
  const { currentScene, choice, character, sceneHistory }: GenerateRequest =
    await request.json()

  try {
    const directorState = buildDirectorState(character, sceneHistory)
    const prompt = buildScenePrompt({
      currentScene,
      choice,
      character,
      sceneHistory,
      directorState,
    })

    let newScene: Scene
    try {
      newScene = await fetchSceneFromOllama(prompt)
    } catch (error) {
      console.error('Ollama failed, using fallback:', error)
      newScene = getFallbackScene(choice.text)
    }

    const ownedArtifacts = new Set(
      character.inventory.map((item) =>
        typeof item === 'string' ? item : item.id,
      ),
    )

    const validatedScene = validateScene(newScene, ownedArtifacts, character)
    const hasLoop = detectSceneLoop(validatedScene, sceneHistory)

    if (hasLoop) {
      throw new Error('Narrative loop detected')
    }

    return NextResponse.json({ scene: validatedScene })
  } catch (error) {
    console.error('API error:', error)

    return NextResponse.json({
      scene: validateScene(
        getFallbackScene('continue onward'),
        new Set(),
        character,
      ),
    })
  }
}
