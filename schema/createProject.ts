import { z } from 'zod'

export const createProject = z.object({
  title: z.string().min(1, 'Title is required').max(20),
  description: z.string().min(1, 'Description is required'),
  github: z.string()
    .url('GitHub URL must be valid')
    .regex(/^https:\/\/github\.com\/[^/]+\/[^/]+$/, 'Invalid GitHub repository URL'),
  demoUrl: z.string().url('Demo URL must be valid').optional().or(z.literal('')),
  technologies: z.array(z.string()).optional(),
})
