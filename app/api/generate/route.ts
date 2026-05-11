import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { currentScene, choice, character } = await request.json()

    const prompt = `
You are a game master for a text-based RPG.
Current scene: "${currentScene.title}" - ${currentScene.description}
Player chose: "${choice.text}"
Player character: ${character.name}, a ${character.class} with stats: strength=${character.stats.strength}, agility=${character.stats.agility}, intelligence=${character.stats.intelligence}.
Inventory: ${character.inventory.join(', ') || 'empty'}.

Generate the next scene in JSON format exactly like this:
{
  "title": "string (short, evocative)",
  "description": "string (2-3 sentences describing the result of the choice)",
  "options": [
    { "id": "opt1", "text": "Option 1 description", "effects": { "strength": 1 } },
    { "id": "opt2", "text": "Option 2 description", "effects": { "agility": 1 } }
  ]
}
Effects can be +1 or -1 on strength, agility, or intelligence. Include at least 2 options, at most 3.
Return ONLY the JSON, no extra text.`

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2:3b',
        prompt: prompt,
        stream: false,
        format: 'json',
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Ollama error:', errorText)
      throw new Error('Ollama generation failed')
    }

    const data = await response.json()
    const newScene = JSON.parse(data.response)

    newScene.id = `scene_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
    newScene.options = newScene.options.map((opt: any, idx: number) => ({
      ...opt,
      id: opt.id || `opt_${idx}`,
    }))

    return NextResponse.json({ scene: newScene })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate scene' },
      { status: 500 },
    )
  }
}
