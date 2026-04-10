/** Matches schema `StaffRole` enum */
export type Role = 'SERVER' | 'COOK' | 'MANAGER' | 'HOST' | 'BARTENDER'

export interface StaffMember {
  id: number
  name: string
  role: Role
  email: string
  phone: string | null
  createdAt: string
}

export interface Assignment {
  id: number
  staffMember: StaffMember
}

/** `day` is ISO date string `YYYY-MM-DD` from the Prisma schema. */
export interface Shift {
  id: number
  day: string
  startTime: string
  endTime: string
  role: Role
  assignments: Assignment[]
  createdAt: string
}
