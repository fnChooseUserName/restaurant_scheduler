import { Request, Response } from "express";

import { toShiftDto } from "../mappers/shiftMapper";
import { createShift, listShifts } from "../services/shiftService";

export const getShifts = async (_req: Request, res: Response): Promise<void> => {
  const shifts = await listShifts();
  res.status(200).json({
    success: true,
    data: shifts.map(toShiftDto)
  });
};

export const postShift = async (req: Request, res: Response): Promise<void> => {
  const created = await createShift(req.body);
  res.status(201).json({
    success: true,
    data: toShiftDto(created)
  });
};
