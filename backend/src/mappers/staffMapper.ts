import type { Shift, ShiftAssignment, StaffMember } from "@prisma/client";

export type StaffDto = {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string | null;
  createdAt: string;
};

export type ShiftSummaryDto = {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  role: string;
  createdAt: string;
};

export type StaffDetailDto = StaffDto & {
  assignments: {
    id: number;
    shift: ShiftSummaryDto;
  }[];
};

export const toStaffDto = (staff: StaffMember): StaffDto => ({
  id: staff.id,
  name: staff.name,
  role: staff.role,
  email: staff.email,
  phone: staff.phone ?? null,
  createdAt: staff.createdAt.toISOString()
});

export const toShiftSummaryDto = (shift: Shift): ShiftSummaryDto => ({
  id: shift.id,
  day: shift.day.toISOString().slice(0, 10),
  startTime: shift.startTime,
  endTime: shift.endTime,
  role: shift.role,
  createdAt: shift.createdAt.toISOString()
});

type StaffWithAssignments = StaffMember & {
  shiftAssignments: (ShiftAssignment & { shift: Shift })[];
};

export const toStaffDetailDto = (staff: StaffWithAssignments): StaffDetailDto => ({
  ...toStaffDto(staff),
  assignments: staff.shiftAssignments.map((sa) => ({
    id: sa.id,
    shift: toShiftSummaryDto(sa.shift)
  }))
});
