import { StaffRole } from "@prisma/client";

import { StaffDto, toStaffDto } from "../mappers/staffMapper";
import { prisma } from "../prisma/client";

export const listStaff = async (): Promise<StaffDto[]> => {
  const rows = await prisma.staffMember.findMany({
    orderBy: { id: "asc" }
  });
  return rows.map(toStaffDto);
};

export const createStaff = async (
  payload: Omit<StaffDto, "id">
): Promise<StaffDto> => {
  const created = await prisma.staffMember.create({
    data: {
      name: payload.name,
      role: payload.role as StaffRole,
      email: payload.email,
      phone: payload.phone ?? undefined
    }
  });
  return toStaffDto(created);
};
