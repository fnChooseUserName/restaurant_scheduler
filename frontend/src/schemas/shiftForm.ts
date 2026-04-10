import { z } from 'zod'

import { ROLE_OPTIONS } from './staffForm'

const isoDateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD')
  .refine((s) => !Number.isNaN(Date.parse(`${s}T00:00:00.000Z`)), 'Invalid date')

const hhmm = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use 24-hour HH:MM')

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export const shiftCreateSchema = z
  .object({
    day: isoDateString,
    startTime: hhmm,
    endTime: hhmm,
    role: z.enum([
      'SERVER',
      'COOK',
      'MANAGER',
      'HOST',
      'BARTENDER',
    ] as const),
  })
  .superRefine((data, ctx) => {
    if (timeToMinutes(data.endTime) <= timeToMinutes(data.startTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End time must be after start time',
        path: ['endTime'],
      })
    }
  })

export type ShiftCreateFormValues = z.infer<typeof shiftCreateSchema>

export { ROLE_OPTIONS }
