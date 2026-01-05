import { z } from 'zod'

export const courseraSchema = z.object({
  shareUrl: z
    .string()
    .url('Coursera URL must be valid')
    .regex(
      /^https?:\/\/(www\.)?coursera\.org\/account\/accomplishments\/verify\/[a-zA-Z0-9-]+$/,
      'Invalid Coursera certificate URL',
    ),
})
