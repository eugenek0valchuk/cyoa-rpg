import { NextResponse } from 'next/server'

import { parseScene } from '@/lib/game/parseScene'
import { buildScenePrompt } from '@/lib/game/promptBuilder'
import { validateScene } from '@/lib/game/validateScene'

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 2,
  delay = 1000,
) {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      return parseScene(data.response)
    } catch (error) {
      if (i === retries) {
        throw error
      }

      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

function getFallbackScene(choiceText: string) {
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

        effects: {
          sanity: -5,
        },
      },

      {
        id: 'observe_shadows',

        text: 'Remain still and observe the darkness',

        effects: {},
      },
    ],
  }
}

export async function POST(request: Request) {
  try {
    const { currentScene, choice, character, sceneHistory } =
      await request.json()

    const prompt = buildScenePrompt({
      currentScene,
      choice,
      character,
      sceneHistory,
    })

    let newSceneData

    try {
      newSceneData = await fetchWithRetry(
        'http://localhost:11434/api/generate',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

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

        2,
        1000,
      )
    } catch (error) {
      console.error('Ollama failed after retries, using fallback:', error)

      newSceneData = getFallbackScene(choice.text)
    }

    const ownedArtifacts = new Set<string>(
      character.inventory.map((item: any) =>
        typeof item === 'string' ? item : String(item.id),
      ),
    )

    const newScene = validateScene(newSceneData, ownedArtifacts)

    return NextResponse.json({
      scene: newScene,
    })
  } catch (error) {
    console.error('API error:', error)

    return NextResponse.json({
      scene: validateScene(getFallbackScene('continue onward'), new Set()),
    })
  }
}
