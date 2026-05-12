import { Choice } from '../types/game'
import { SceneSchema } from './schema/sceneSchema'

export function parseScene(raw: string) {
  try {
    const parsed = JSON.parse(raw)

    parsed.description = parsed.description?.replace(/\n{3,}/g, '\n\n')?.trim()

    parsed.options = parsed.options?.map((option: Choice) => ({
      ...option,
      text: option.text?.trim(),
    }))

    return SceneSchema.parse(parsed)
  } catch (e) {
    console.error('Scene parse failed:', raw.slice(0, 500), e)

    return {
      id: 'fallback_scene',

      title: 'Distortion',

      description: 'Reality fractures into incoherent fragments.',

      options: [
        {
          id: 'recover',

          text: 'Attempt to recover your thoughts',
        },

        {
          id: 'listen',

          text: 'Listen to the distant whisper',
        },
      ],
    }
  }
}
