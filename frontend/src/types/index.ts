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

/** List/detail summary shape for a shift (e.g. nested under staff detail). */
export interface ShiftSummary {
  id: number
  day: string
  startTime: string
  endTime: string
  role: Role
  createdAt: string
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

/** Staff row from `GET /staff/:id` — includes linked shifts. */
export type StaffMemberDetail = StaffMember & {
  assignments: { id: number; shift: ShiftSummary }[]
}

export type CreateStaffPayload = {
  name: string
  role: Role
  email: string
  phone?: string
}

export type UpdateStaffPayload = Partial<CreateStaffPayload>

export type CreateShiftPayload = {
  day: string
  startTime: string
  endTime: string
  role: Role
}

export type UpdateShiftPayload = Partial<CreateShiftPayload>
