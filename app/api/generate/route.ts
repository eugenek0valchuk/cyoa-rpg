import { NextResponse } from 'next/server'

import { getFallbackScene } from '@/lib/game/fallbackScene'
import { buildScenePrompt } from '@/lib/game/promptBuilder'
import { normalizeEffects } from '@/lib/game/sceneNormalizer'

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 2,
  delay = 1000,
): Promise<any> {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      let parsed

      try {
        parsed = JSON.parse(data.response)
      } catch (_e) {
        throw new Error('Invalid JSON from model')
      }

      return parsed
    } catch (error) {
      if (i === retries) {
        throw error
      }

      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw new Error('Unreachable')
}

function normalizeScene(newSceneData: any, character: any) {
  const title =
    typeof newSceneData.title === 'string'
      ? newSceneData.title
      : 'Unknown Depths'

  const description =
    typeof newSceneData.description === 'string'
      ? newSceneData.description
      : 'The darkness shifts around you as the descent continues.'

  let options = Array.isArray(newSceneData.options) ? newSceneData.options : []

  if (options.length === 0) {
    options = [
      {
        id: 'forward',

        text: 'Continue onward',

        effects: {},
      },

      {
        id: 'listen',

        text: 'Listen to the distant whispers',

        effects: {
          sanity: -2,
        },
      },
    ]
  }

  const ownedArtifacts = new Set<string>(
    character.inventory.map((item: any) => String(item.id)),
  )

  const normalizedOptions = options.map((opt: any, idx: number) => ({
    id: typeof opt.id === 'string' ? opt.id : `opt_${idx}`,

    text: typeof opt.text === 'string' ? opt.text : `Choice ${idx + 1}`,

    effects: normalizeEffects(opt.effects || {}, ownedArtifacts),
  }))

  return {
    id: `scene_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,

    title,

    description,

    options: normalizedOptions,
  }
}

async function generateScene(prompt: string) {
  return fetchWithRetry(
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
          temperature: 0.9,
          top_p: 0.95,
        },
      }),
    },

    2,
    1000,
  )
}

export async function POST(request: Request) {
  try {
    const { currentScene, choice, character } = await request.json()

    const prompt = buildScenePrompt({
      currentScene,
      choice,
      character,
    })

    let newSceneData

    try {
      newSceneData = await generateScene(prompt)
    } catch (error) {
      console.error('Ollama failed after retries, using fallback:', error)

      newSceneData = getFallbackScene(choice.text)
    }

    const newScene = normalizeScene(newSceneData, character)

    return NextResponse.json({
      scene: newScene,
    })
  } catch (error) {
    console.error('API error:', error)

    const fallbackScene = getFallbackScene('continue onward')

    return NextResponse.json({
      scene: fallbackScene,
    })
  }
}
