export type ShiftDto = {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  role: string;
};

export const toShiftDto = (shift: ShiftDto): ShiftDto => ({
  id: shift.id,
  day: shift.day,
  startTime: shift.startTime,
  endTime: shift.endTime,
  role: shift.role
});
