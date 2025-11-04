import { z } from 'zod'

export const verifyOTPSchema = z.object({
  otp: z
    .string()
    .min(6, { message: 'OTP must be at least 6 digits' })
    .max(6, { message: 'OTP must be exactly 6 digits' })
    .regex(/^\d+$/, { message: 'OTP must contain numbers only' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
})

export type VerifyOtpDto = z.input<typeof verifyOTPSchema>
