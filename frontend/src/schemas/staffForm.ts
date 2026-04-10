import { z } from 'zod'

import type { Role } from '../types'

const roleEnum = z.enum([
  'SERVER',
  'COOK',
  'MANAGER',
  'HOST',
  'BARTENDER',
] as const)

export const staffCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  role: roleEnum,
})

export type StaffCreateFormValues = z.infer<typeof staffCreateSchema>

export const ROLE_OPTIONS: Role[] = [
  'SERVER',
  'COOK',
  'MANAGER',
  'HOST',
  'BARTENDER',
]
