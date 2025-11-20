import { z } from 'zod'

export const createSkill = z.object({
  name: z.string().min(1, 'Skill name is required'),
  description: z.string().min(1, 'Description is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
})
