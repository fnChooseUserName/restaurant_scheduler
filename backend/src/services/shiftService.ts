import { ShiftDto } from "../mappers/shiftMapper";

export const listShifts = async (): Promise<ShiftDto[]> => {
  return [];
};

export const createShift = async (
  payload: Omit<ShiftDto, "id">
): Promise<ShiftDto> => {
  return { id: 1, ...payload };
};
