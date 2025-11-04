import { z } from 'zod'

export const updatePasswordSchema = z.object({
    newPassword: z.string().min(6, { message: 'New Password must be at least 6 digits' }),
})
export type LoginDto = z.input<typeof updatePasswordSchema>
