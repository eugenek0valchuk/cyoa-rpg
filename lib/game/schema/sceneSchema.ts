import { z } from 'zod'

export const ChoiceSchema = z.object({
  id: z
    .string()
    .max(40)
    .regex(/^[a-z0-9_]+$/),
  text: z.string().max(120),
  requirements: z
    .object({
      minCorruption: z.number().optional(),
      maxSanity: z.number().optional(),
      requiredArtifact: z.string().max(40).optional(),
      requiredFlag: z.string().max(60).optional(),
    })
    .optional(),
  effects: z
    .object({
      sanity: z.number().min(-10).max(10).optional(),
      corruption: z.number().min(-10).max(10).optional(),
      addFlag: z.string().max(60).optional(),
      addArtifact: z.string().max(40).optional(),
    })
    .optional(),
})

export const SceneSchema = z.object({
  id: z
    .string()
    .max(40)
    .regex(/^[a-z0-9_]+$/),
  title: z.string().max(80),
  description: z.string().max(1200),
  options: z.array(ChoiceSchema).min(2).max(4),
})

export type ParsedScene = z.infer<typeof SceneSchema>
