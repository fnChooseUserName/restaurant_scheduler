import { StaffRole } from "@prisma/client";

import { AppError } from "../errors/AppError";
import { prisma } from "../prisma/client";

export type CreateStaffInput = {
  name: string;
  role: string;
  email: string;
  phone?: string;
};

export type UpdateStaffInput = Partial<CreateStaffInput>;

/** Prisma include for staff detail: assignments and each related shift. */
const staffDetailInclude = {
  shiftAssignments: {
    include: { shift: true },
    orderBy: { id: "asc" as const }
  }
} as const;

/** Loads all staff rows for list endpoints (controllers map to DTOs). */
export const listStaff = async () => {
  return prisma.staffMember.findMany({
    orderBy: { id: "asc" }
  });
};

/** Persists a new staff member; uniqueness of email is enforced by Prisma/schema. */
export const createStaff = async (payload: CreateStaffInput) => {
  return prisma.staffMember.create({
    data: {
      name: payload.name,
      role: payload.role as StaffRole,
      email: payload.email,
      phone: payload.phone ?? undefined
    }
  });
};

/**
 * Loads one staff member with shift assignments and nested shifts, or throws 404.
 * `id` must already be a validated positive integer (see `parsePositiveIntParam`).
 */
export const getStaffById = async (id: number) => {
  const staff = await prisma.staffMember.findUnique({
    where: { id },
    include: staffDetailInclude
  });
  if (!staff) {
    throw new AppError("Staff member not found", 404);
  }
  return staff;
};

/**
 * Applies partial updates; if the body is empty, returns the existing row without writing.
 * Throws 404 when the staff row does not exist.
 */
export const updateStaff = async (id: number, payload: UpdateStaffInput) => {
  const existing = await prisma.staffMember.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Staff member not found", 404);
  }
  const data = {
    ...(payload.name !== undefined && { name: payload.name }),
    ...(payload.role !== undefined && { role: payload.role as StaffRole }),
    ...(payload.email !== undefined && { email: payload.email }),
    ...(payload.phone !== undefined && { phone: payload.phone || null })
  };
  if (Object.keys(data).length === 0) {
    return existing;
  }
  return prisma.staffMember.update({
    where: { id },
    data
  });
};

/** Deletes by id; maps Prisma “not found” to a 404 `AppError`. */
export const deleteStaff = async (id: number): Promise<void> => {
  try {
    await prisma.staffMember.delete({ where: { id } });
  } catch {
    throw new AppError("Staff member not found", 404);
  }
};
