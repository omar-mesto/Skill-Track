import { z } from 'zod'

export const forgetPasswordSchema = z.object({
    email: z.string().email().min(1),
})
export type LoginDto = z.input<typeof forgetPasswordSchema>
