import { z } from 'zod'

export const registerProfessorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  specialization: z.string().min(1, 'Specialization Name is required'),
  bio: z.string().min(1, 'Bio is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must 6 characters'),
})
