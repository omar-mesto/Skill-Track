import { z } from 'zod'

export const registerCompanySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  companyName: z.string().min(1, 'Company Name is required'),
  bio: z.string().min(1, 'Bio is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must 6 characters'),
})
