import { Request, Response } from "express";

import { asyncHandler } from "../middleware/asyncHandler";
import { toShiftDto } from "../mappers/shiftMapper";
import {
  assignStaffToShift,
  createShift,
  deleteShift,
  getShiftById,
  listShifts,
  unassignStaffFromShift,
  updateShift
} from "../services/shiftService";
import { parsePositiveIntParam } from "../utils/params";

export const getShifts = asyncHandler(async (_req: Request, res: Response) => {
  const rows = await listShifts();
  res.status(200).json({
    success: true,
    data: rows.map(toShiftDto)
  });
});

export const postShift = asyncHandler(async (req: Request, res: Response) => {
  const created = await createShift(req.body);
  res.status(201).json({
    success: true,
    data: toShiftDto(created)
  });
});

export const postShiftAssign = asyncHandler(async (req: Request, res: Response) => {
  const shiftId = parsePositiveIntParam(req.params.id);
  const updated = await assignStaffToShift(shiftId, req.body.staffMemberId);
  res.status(201).json({
    success: true,
    data: toShiftDto(updated)
  });
});

export const deleteShiftAssign = asyncHandler(async (req: Request, res: Response) => {
  const shiftId = parsePositiveIntParam(req.params.id);
  const staffId = parsePositiveIntParam(req.params.staffId);
  await unassignStaffFromShift(shiftId, staffId);
  res.status(204).send();
});

export const getShiftByIdHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = parsePositiveIntParam(req.params.id);
  const shift = await getShiftById(id);
  res.status(200).json({
    success: true,
    data: toShiftDto(shift)
  });
});

export const putShift = asyncHandler(async (req: Request, res: Response) => {
  const id = parsePositiveIntParam(req.params.id);
  const updated = await updateShift(id, req.body);
  res.status(200).json({
    success: true,
    data: toShiftDto(updated)
  });
});

export const deleteShiftMember = asyncHandler(async (req: Request, res: Response) => {
  const id = parsePositiveIntParam(req.params.id);
  await deleteShift(id);
  res.status(204).send();
});
