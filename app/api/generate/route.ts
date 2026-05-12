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
}

function getFallbackScene(choiceText: string) {
  return {
    id: `fallback_${Date.now()}`,

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
    const { currentScene, choice, character } = await request.json()

    const artifactContext =
      character.inventory?.length > 0
        ? `
ARTIFACTS CURRENTLY CARRIED:

${character.inventory
  .map(
    (artifact: any) => `
- ${artifact.name}

${artifact.description}

Effects:
Sanity: ${artifact.effects?.sanity ?? 0}
Corruption: ${artifact.effects?.corruption ?? 0}
`,
  )
  .join('\n')}
`
        : 'The player carries no artifacts.'

    const prompt = `
You are the narrator and game master of a dark gothic horror RPG called DESCENT.

The tone is:
- oppressive
- cosmic horror
- religious decay
- cursed cathedrals
- abyssal entities
- psychological terror
- forbidden relics
- dying kingdoms
- blood rituals
- whispers beneath stone

Never write humor.
Never write modern language.
Never write generic fantasy.

The narration must feel ancient, poetic, cursed, and oppressive.

CURRENT SCENE:
"${currentScene.title}"

${currentScene.description}

PLAYER CHOICE:
"${choice.text}"

PLAYER:
Name: ${character.name}
Origin: ${character.origin}

STATS:
Strength: ${character.stats.strength}
Agility: ${character.stats.agility}
Intelligence: ${character.stats.intelligence}

MENTAL STATE:
Sanity: ${character.sanity}
Corruption: ${character.corruption}

${artifactContext}

AVAILABLE ARTIFACTS:

- ashen_faceless_mask
A burned iron mask recovered from beneath the ash crypt.

- inverted_rosary
A rosary with reversed prayers carved into bone.

- black_veil_fragment
A fragment of cloth taken from a faceless saint.

- bell_of_the_below
A small black bell that rings without touch.

IMPORTANT RULES ABOUT ARTIFACTS:

- NEVER give an artifact the player already owns
- NEVER repeat the same artifact twice
- ONLY use artifact ids from the list above
- addArtifact must always be a string id
- addFlag must always be a string
- NEVER use booleans for addFlag
- Artifacts should be extremely rare
- Most scenes should NOT reward artifacts
- Artifacts should only appear during major discoveries, rituals, crypts, forbidden encounters, or abyssal events

GENERAL RULES:
- Artifacts must influence the world and narration
- Corruption should slowly distort reality
- High corruption may unlock forbidden events
- Low sanity may introduce whispers, visions, hallucinations
- Scenes must continue naturally from previous events
- Choices should feel dangerous and meaningful
- Avoid repetition
- Keep descriptions immersive
- Add subtle lore implications
- Sometimes imply unseen entities watching the player

Generate the next scene in STRICT JSON format:

{
  "title": "short dark title",
  "description": "3-6 atmospheric sentences",
  "options": [
    {
      "id": "option_id",
      "text": "Choice text",
      "effects": {
        "sanity": -5
      }
    }
  ]
}

Allowed effects:
- sanity
- corruption
- addFlag
- addArtifact

Artifact example:
{
  "id": "take_mask",
  "text": "Take the burned iron mask",
  "effects": {
    "addArtifact": "ashen_faceless_mask",
    "corruption": 5
  }
}

Return ONLY valid JSON.
`

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
          }),
        },

        2,
        1000,
      )
    } catch (error) {
      console.error('Ollama failed after retries, using fallback:', error)

      newSceneData = getFallbackScene(choice.text)
    }

    const title = newSceneData.title || 'Unknown Depths'

    const description =
      newSceneData.description ||
      'The darkness shifts around you as the descent continues.'

    let options = newSceneData.options || []

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

    const ownedArtifacts = new Set(
      character.inventory.map((item: any) => item.id),
    )

    const normalizedOptions = options.map((opt: any, idx: number) => {
      const effects = opt.effects || {}

      if (effects.addArtifact && ownedArtifacts.has(effects.addArtifact)) {
        delete effects.addArtifact
      }

      if (effects.addFlag && typeof effects.addFlag !== 'string') {
        delete effects.addFlag
      }

      return {
        id: opt.id || `opt_${idx}`,

        text: opt.text || `Choice ${idx + 1}`,

        effects,
      }
    })

    const newScene = {
      id: `scene_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,

      title,

      description,

      options: normalizedOptions,
    }

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
