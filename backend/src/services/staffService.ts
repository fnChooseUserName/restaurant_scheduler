import { StaffDto } from "../mappers/staffMapper";

export const listStaff = async (): Promise<StaffDto[]> => {
  return [];
};

export const createStaff = async (
  payload: Omit<StaffDto, "id">
): Promise<StaffDto> => {
  return { id: 1, ...payload };
};
