import { StaffRole } from "@prisma/client";

import { AppError } from "../errors/AppError";
import { prisma } from "../prisma/client";

/** Parses `HH:MM` (24h) to minutes since midnight; returns NaN if the string is invalid. */
function parseHHMM(s: string): number {
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(s);
  if (!m) {
    return NaN;
  }
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

/**
 * Enforces `endTime` strictly after `startTime` on the same calendar day assumption.
 * Used for create and update so this rule stays in the service layer, not Zod.
 */
function assertEndAfterStart(start: string, end: string): void {
  const a = parseHHMM(start);
  const b = parseHHMM(end);
  if (Number.isNaN(a) || Number.isNaN(b)) {
    throw new AppError("Invalid time format", 422);
  }
  if (b <= a) {
    throw new AppError("endTime must be after startTime", 422);
  }
}

/** Interprets `YYYY-MM-DD` as UTC midnight for consistent `DateTime` storage. */
function dayStringToUtcDate(day: string): Date {
  return new Date(`${day}T00:00:00.000Z`);
}

export type CreateShiftInput = {
  day: string;
  startTime: string;
  endTime: string;
  role: string;
};

export type UpdateShiftInput = Partial<CreateShiftInput>;

/** Prisma include: each shift’s assignment rows with full staff member for API mapping. */
const shiftWithAssignmentsInclude = {
  shiftAssignments: {
    include: { staffMember: true },
    orderBy: { id: "asc" as const }
  }
} as const;

/** Lists all shifts with assignments and staff, ordered by shift id. */
export const listShifts = async () => {
  return prisma.shift.findMany({
    orderBy: { id: "asc" },
    include: shiftWithAssignmentsInclude
  });
};

/** Returns one shift with assignments or throws 404. */
export const getShiftById = async (id: number) => {
  const shift = await prisma.shift.findUnique({
    where: { id },
    include: shiftWithAssignmentsInclude
  });
  if (!shift) {
    throw new AppError("Shift not found", 404);
  }
  return shift;
};

/**
 * Creates a shift after validating end-after-start. Day must match the validated API format
 * (`YYYY-MM-DD`) from the controller layer.
 */
export const createShift = async (payload: CreateShiftInput) => {
  assertEndAfterStart(payload.startTime, payload.endTime);
  return prisma.shift.create({
    data: {
      day: dayStringToUtcDate(payload.day),
      startTime: payload.startTime,
      endTime: payload.endTime,
      role: payload.role as StaffRole
    },
    include: shiftWithAssignmentsInclude
  });
};

/**
 * Merges partial payload with the existing shift, re-validates time ordering, and updates.
 * No-op body yields a fresh read with includes (no empty Prisma update).
 */
export const updateShift = async (id: number, payload: UpdateShiftInput) => {
  const existing = await prisma.shift.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Shift not found", 404);
  }
  const startTime = payload.startTime ?? existing.startTime;
  const endTime = payload.endTime ?? existing.endTime;
  assertEndAfterStart(startTime, endTime);
  const hasData =
    payload.day !== undefined ||
    payload.startTime !== undefined ||
    payload.endTime !== undefined ||
    payload.role !== undefined;
  if (!hasData) {
    return prisma.shift.findUniqueOrThrow({
      where: { id },
      include: shiftWithAssignmentsInclude
    });
  }
  return prisma.shift.update({
    where: { id },
    data: {
      ...(payload.day !== undefined && { day: dayStringToUtcDate(payload.day) }),
      ...(payload.startTime !== undefined && { startTime: payload.startTime }),
      ...(payload.endTime !== undefined && { endTime: payload.endTime }),
      ...(payload.role !== undefined && { role: payload.role as StaffRole })
    },
    include: shiftWithAssignmentsInclude
  });
};

/** Deletes a shift; maps missing row to 404. */
export const deleteShift = async (id: number): Promise<void> => {
  try {
    await prisma.shift.delete({ where: { id } });
  } catch {
    throw new AppError("Shift not found", 404);
  }
};

/**
 * Creates a `ShiftAssignment` after verifying both entities exist and the pair is unique.
 * Returns the updated shift (reloaded with assignments) for 201 responses.
 */
export const assignStaffToShift = async (shiftId: number, staffMemberId: number) => {
  const shift = await prisma.shift.findUnique({ where: { id: shiftId } });
  if (!shift) {
    throw new AppError("Shift not found", 404);
  }
  const staff = await prisma.staffMember.findUnique({ where: { id: staffMemberId } });
  if (!staff) {
    throw new AppError("Staff member not found", 404);
  }
  const duplicate = await prisma.shiftAssignment.findFirst({
    where: { shiftId, staffMemberId }
  });
  if (duplicate) {
    throw new AppError("This staff member is already assigned to this shift", 409);
  }
  await prisma.shiftAssignment.create({
    data: { shiftId, staffMemberId }
  });
  return getShiftById(shiftId);
};

/** Removes an assignment by shift + staff ids; 404 if the row does not exist. */
export const unassignStaffFromShift = async (
  shiftId: number,
  staffMemberId: number
): Promise<void> => {
  const assignment = await prisma.shiftAssignment.findFirst({
    where: { shiftId, staffMemberId }
  });
  if (!assignment) {
    throw new AppError("Assignment not found", 404);
  }
  await prisma.shiftAssignment.delete({ where: { id: assignment.id } });
};
