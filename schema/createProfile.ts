import { z } from 'zod'

export const updateProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional().or(z.literal('')),
  university: z.string().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  postion: z.string().min(1, 'Position is required'),
})

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>
