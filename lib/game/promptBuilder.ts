import type { Character, Choice, Scene } from '@/lib/types/game'

interface BuildScenePromptParams {
  currentScene: Scene
  choice: Choice
  character: Character
}

export function buildScenePrompt({
  currentScene,
  choice,
  character,
}: BuildScenePromptParams) {
  const artifactContext =
    character.inventory?.length > 0
      ? `
ARTIFACTS CURRENTLY CARRIED:

${character.inventory
  .map(
    (artifact) => `
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

  return `
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

Return ONLY valid JSON.
`
}
