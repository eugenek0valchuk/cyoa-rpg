import { NextResponse } from 'next/server'

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 2,
  delay = 1000,
): Promise<any> {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, options)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      let parsed
      try {
        parsed = JSON.parse(data.response)
      } catch (_e) {
        throw new Error('Invalid JSON from model')
      }
      return parsed
    } catch (error) {
      if (i === retries) throw error
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

function getFallbackScene(choiceText: string, _character: any) {
  return {
    id: `fallback_${Date.now()}`,
    title: 'Unexpected Turn',
    description: `You chose "${choiceText}". The path ahead is unclear, but you push forward.`,
    options: [
      {
        id: 'opt1',
        text: 'Continue carefully',
        effects: { agility: 1 },
      },
      {
        id: 'opt2',
        text: 'Press on boldly',
        effects: { strength: 1 },
      },
    ],
  }
}

export async function POST(request: Request) {
  try {
    const { currentScene, choice, character } = await request.json()
    const prompt = `
You are a game master. Current scene: "${currentScene.title}" - ${currentScene.description}
Player chose: "${choice.text}"
Player: ${character.name}, a ${character.class}. Stats: strength=${character.stats.strength}, agility=${character.stats.agility}, intelligence=${character.stats.intelligence}.
Inventory: ${character.inventory.join(', ') || 'empty'}.

Generate the next scene in JSON format:
{
  "title": "short title",
  "description": "2-3 sentences",
  "options": [
    { "id": "opt1", "text": "Option 1", "effects": { "strength": 1 } },
    { "id": "opt2", "text": "Option 2", "effects": { "agility": 1 } }
  ]
}
Effects can be +1/-1 on strength, agility, intelligence. Return ONLY valid JSON.`

    let newSceneData
    try {
      newSceneData = await fetchWithRetry(
        'http://localhost:11434/api/generate',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'llama3.2:3b',
            prompt: prompt,
            stream: false,
            format: 'json',
          }),
        },
        2,
        1000,
      )
    } catch (error) {
      console.error('Ollama failed after retries, using fallback:', error)
      newSceneData = getFallbackScene(choice.text, character)
    }

    const title = newSceneData.title || 'Unknown'
    const description = newSceneData.description || 'The journey continues...'
    let options = newSceneData.options || []

    if (options.length === 0) {
      options = [
        { id: 'opt1', text: 'Move forward', effects: {} },
        { id: 'opt2', text: 'Step back', effects: {} },
      ]
    }

    const normalizedOptions = options.map((opt: any, idx: number) => ({
      id: opt.id || `opt_${idx}`,
      text: opt.text || `Option ${idx + 1}`,
      effects: opt.effects || {},
    }))
    const newScene = {
      id: `scene_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      title,
      description,
      options: normalizedOptions,
    }

    return NextResponse.json({ scene: newScene })
  } catch (error) {
    console.error('API error:', error)
    const fallbackScene = getFallbackScene('an action', null)
    return NextResponse.json({ scene: fallbackScene })
  }
}
