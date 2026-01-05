import { z } from 'zod'

export const createAchievement = z.object({
  title: z.string().min(1, 'Title is required').max(20),
})
