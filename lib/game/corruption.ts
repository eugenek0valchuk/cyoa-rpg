export type CorruptionStage =
  | 'pure'
  | 'disturbed'
  | 'tainted'
  | 'fallen'
  | 'abyssal'

export function getCorruptionStage(corruption: number): CorruptionStage {
  if (corruption >= 90) {
    return 'abyssal'
  }

  if (corruption >= 70) {
    return 'fallen'
  }

  if (corruption >= 45) {
    return 'tainted'
  }

  if (corruption >= 25) {
    return 'disturbed'
  }

  return 'pure'
}

export function getCorruptionEffects(corruption: number) {
  const stage = getCorruptionStage(corruption)

  switch (stage) {
    case 'pure':
      return {
        stage,

        narration:
          'Reality still obeys familiar laws. The silence feels natural.',

        extraPrompt: `
The world still appears mostly normal.
Horror should remain subtle and atmospheric.
Do not introduce impossible reality distortions yet.
`,
      }

    case 'disturbed':
      return {
        stage,

        narration:
          'Shadows linger too long. Whispers seem to answer your breathing.',

        extraPrompt: `
Introduce subtle psychological horror.
Small hallucinations are allowed.
The player may notice movement in darkness.
Religious imagery may feel wrong or decayed.
`,
      }

    case 'tainted':
      return {
        stage,

        narration: 'The cathedral no longer feels built by human hands.',

        extraPrompt: `
Reality becomes unstable.
Architecture may shift.
Whispers may directly address the player.
The abyss should feel alive.
`,
      }

    case 'fallen':
      return {
        stage,

        narration: 'The world bends beneath unseen abyssal influence.',

        extraPrompt: `
Heavy cosmic horror.
Reality distortion is common.
Impossible geometry may appear.
The player may lose certainty of what is real.
`,
      }

    case 'abyssal':
      return {
        stage,

        narration: 'The abyss recognizes the player as one of its own.',

        extraPrompt: `
Full descent into cosmic horror.
Reality is broken.
The world should feel dreamlike, cursed, and hostile.
Ancient entities may directly acknowledge the player.
`,
      }

    default:
      return {
        stage: 'pure',

        narration: '',

        extraPrompt: '',
      }
  }
}
