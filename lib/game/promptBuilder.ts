import { getCorruptionPrompt, getCorruptionStage } from '@/lib/game/corruption'

import { GENERAL_RULES } from './prompts/generalRules'
import { ANTI_REPETITION_RULES } from './prompts/antiRepetitionRules'
import { ARTIFACT_RULES } from './prompts/artifactRules'

import { Character, Choice, Scene, SceneHistoryEntry } from '../types/game'

import { lore } from './lore'

import type { DirectorState, SceneType, StoryPhase } from './director'
import { getRelevantLore } from './relevantLore'

interface BuildScenePromptParams {
  currentScene: Scene
  choice: Choice
  character: Character
  sceneHistory: SceneHistoryEntry[]
  directorState: DirectorState
}

export function buildScenePrompt({
  currentScene,
  choice,
  character,
  sceneHistory,
  directorState,
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

  const historyContext =
    sceneHistory?.length > 0
      ? `
PREVIOUS SCENES:

${sceneHistory
  .slice(-6)
  .map(
    (scene) => `
- ${scene.title}

${scene.description.slice(0, 180)}
`,
  )
  .join('\n')}
`
      : ''

  const corruptionPrompt = getCorruptionPrompt(character.corruption)

  const relevantLore = getRelevantLore({
    currentScene,
    corruption: character.corruption,
    flags: character.flags,
    history: sceneHistory,
  })

  return `
You are the narrator of a dark gothic horror RPG called DESCENT.

You describe:
- scenes
- atmosphere
- entities
- discoveries
- choices

You do NOT control permanent progression.
You do NOT invent new mechanics.

The narration must feel:
- ancient
- cursed
- oppressive
- poetic
- psychologically disturbing

Narration must always be written in second person.
Never refer to "the player".
Never explain emotions directly.
Imply fear through atmosphere and sensory detail.

${corruptionPrompt}

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

WORLD STATE:

Story Phase:
${directorState.phase}

Target Scene Type:
${directorState.nextSceneType}

Escalation Level:
${directorState.escalationLevel}/10

Ending Pressure:
${directorState.forceEnding ? 'HIGH' : 'LOW'}

Corruption Stage:
${getCorruptionStage(character.corruption)}

Known Flags:
${character.flags.length > 0 ? character.flags.join(', ') : 'none'}

Artifacts Carried:
${
  character.inventory.length > 0
    ? character.inventory.map((a) => a.name).join(', ')
    : 'none'
}

${artifactContext}

${historyContext}

RELEVANT LORE:

${relevantLore}

WORLD LORE:

${lore.world}

FACTIONS:
${lore.factions.join('\n')}

ENTITIES:
${lore.entities.join('\n')}

REGIONS:
${lore.regions.join('\n')}

AVAILABLE ARTIFACTS:

- ashen_faceless_mask
- inverted_rosary
- black_veil_fragment
- bell_of_the_below

${GENERAL_RULES}

${ANTI_REPETITION_RULES}

${ARTIFACT_RULES}

STORY PHASE RULES:

DESCENT:
- grounded horror
- subtle dread
- exploration
- mystery

WHISPERS:
- paranoia
- hidden truths
- distorted perception
- psychological pressure

FRACTURE:
- impossible architecture
- temporal distortion
- identity instability
- environmental decay

COMMUNION:
- direct abyss contact
- body horror
- irreversible corruption
- ritual imagery

COLLAPSE:
- reality disintegration
- ending-state progression
- cosmic horror
- loss of self

SCENE TYPE RULES:

exploration:
- discover new areas
- environmental storytelling

encounter:
- entity interaction
- immediate danger

revelation:
- major lore discovery
- hidden truth
- irreversible realization

ritual:
- forbidden ceremony
- transformation
- sacrifice

nightmare:
- dream logic
- surreal horror

transition:
- movement toward escalation

ending:
- irreversible climax

ANTI-LOOP RULES:

- NEVER repeat previous scene titles
- NEVER repeat the same scene structure
- NEVER generate recursive loops
- NEVER fallback into generic abyss descriptions
- EVERY scene must introduce progression
- EVERY 3 scenes must escalate tension
- Locations must evolve over time
- Previously visited concepts must transform
- Avoid repeating:
  - bells echoing
  - oppressive silence
  - ash drifting
  - unseen whispers
  - reality fractures

RULES FOR OPTIONS:

- Generate between 2 and 4 options only
- Every option must feel distinct
- Avoid obvious good/bad choices
- At least one option should feel risky
- Avoid duplicate outcomes
- Avoid filler choices

IMPORTANT:

Effects should be minimal and conservative.

Most effects should range between:
-5 and +5

Option ids must:
- use snake_case only
- contain no spaces
- be short
- be unique

Scene titles must:
- be short
- be unique
- avoid generic horror words
- avoid repeating previous naming patterns

CRITICAL JSON RULES:

Effects must ALWAYS follow this schema:

{
  "sanity": number,
  "corruption": number,
  "addFlag": "string_flag",
  "addArtifact": "artifact_id"
}

NEVER:
- use arrays for addFlag
- use arrays for addArtifact
- use strings instead of numbers
- place effects inside requirements
- invent new effect fields

VALID:
"effects": {
  "sanity": -5,
  "addFlag": "heard_the_bell"
}

INVALID:
"effects": {
  "addFlag": ["heard_the_bell"]
}

INVALID:
"effects": {
  "corruption": "-5"
}

Generate the next scene in STRICT JSON format:

{
  "title": "short dark title",

  "description": "2-4 concise atmospheric sentences",

  "options": [
    {
      "id": "option_id",

      "text": "Choice text",

      "requirements": {
        "minCorruption": 40
      },

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
