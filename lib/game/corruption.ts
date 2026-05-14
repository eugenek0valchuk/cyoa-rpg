export function getCorruptionStage(corruption: number): string {
  if (corruption >= 75) {
    return 'ABYSSAL'
  }

  if (corruption >= 50) {
    return 'POSSESSED'
  }

  if (corruption >= 25) {
    return 'WHISPERS'
  }

  return 'NORMAL'
}

export function getCorruptionPrompt(corruption: number): string {
  const stage = getCorruptionStage(corruption)

  switch (stage) {
    case 'WHISPERS':
      return `
CORRUPTION STATE: WHISPERS

Reality begins to distort subtly.

The player may:
- hear whispers beneath stone
- see movement in darkness
- notice impossible sounds
- feel watched by unseen entities

Descriptions should feel psychologically oppressive.
`

    case 'POSSESSED':
      return `
CORRUPTION STATE: POSSESSED

Reality is unstable.

The player may:
- hallucinate architecture shifting
- hear dead voices
- experience missing time
- feel entities moving beneath skin
- witness impossible religious imagery

The world should feel hostile, surreal, and cursed.
`

    case 'ABYSSAL':
      return `
CORRUPTION STATE: ABYSSAL

Reality has almost collapsed entirely.

The player may:
- see abyssal entities directly
- experience fractured time
- witness impossible geometry
- merge with forbidden forces
- lose distinction between dream and reality

Descriptions should become cosmic, apocalyptic, and horrifying.
`

    default:
      return `
CORRUPTION STATE: NORMAL

Reality remains mostly stable.

Horror should remain subtle, atmospheric, and grounded.
`
  }
}

export function getCorruptionGameplayRules(corruption: number) {
  const stage = getCorruptionStage(corruption)
  switch (stage) {
    case 'WHISPERS':
      return {
        maxOptions: 4,
        allowHallucinations: true,
        forceParanoia: true,
      }
    case 'POSSESSED':
      return {
        maxOptions: 3,
        allowRealityBreaks: true,
        forceBodyHorror: true,
      }
    case 'ABYSSAL':
      return {
        maxOptions: 2,
        forceEndingProgression: true,
        allowImpossibleScenes: true,
      }
    default:
      return {
        maxOptions: 4,
      }
  }
}
