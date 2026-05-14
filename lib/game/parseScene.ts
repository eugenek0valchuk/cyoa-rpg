import { createSceneId } from './createSceneId'
import { SceneSchema } from './schema/sceneSchema'

export function parseScene(raw: string) {
  try {
    const parsed = JSON.parse(raw)

    parsed.id ??= createSceneId()

    parsed.id = String(parsed.id)
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_')

    parsed.description = parsed.description?.replace(/\n{3,}/g, '\n\n')?.trim()

    parsed.options = parsed.options?.map((option: any) => ({
      ...option,
      id: String(option.id)
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_'),
      text: option.text?.trim(),
      requirements: option.requirements ?? undefined,
      effects: option.effects ?? undefined,
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
          id: 'submit',
          text: 'Let the abyss consume you',
        },
      ],
    }
  }
}
