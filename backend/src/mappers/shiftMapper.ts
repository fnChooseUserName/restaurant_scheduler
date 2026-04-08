import type { Shift, ShiftAssignment, StaffMember } from "@prisma/client";

import { StaffDto, toStaffDto } from "./staffMapper";

export type ShiftDto = {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  role: string;
  assignments: {
    id: number;
    staffMember: StaffDto;
  }[];
  createdAt: string;
};

type ShiftWithAssignments = Shift & {
  shiftAssignments: (ShiftAssignment & { staffMember: StaffMember })[];
};

export const toShiftDto = (shift: ShiftWithAssignments): ShiftDto => ({
  id: shift.id,
  day: shift.day.toISOString().slice(0, 10),
  startTime: shift.startTime,
  endTime: shift.endTime,
  role: shift.role,
  assignments: shift.shiftAssignments.map((sa) => ({
    id: sa.id,
    staffMember: toStaffDto(sa.staffMember)
  })),
  createdAt: shift.createdAt.toISOString()
});
