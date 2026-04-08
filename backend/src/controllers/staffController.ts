import { Request, Response } from "express";

import { asyncHandler } from "../middleware/asyncHandler";
import { toStaffDetailDto, toStaffDto } from "../mappers/staffMapper";
import {
  createStaff,
  deleteStaff,
  getStaffById,
  listStaff,
  updateStaff
} from "../services/staffService";
import { parsePositiveIntParam } from "../utils/params";

export const getStaffList = asyncHandler(async (_req: Request, res: Response) => {
  const rows = await listStaff();
  res.status(200).json({
    success: true,
    data: rows.map(toStaffDto)
  });
});

export const postStaff = asyncHandler(async (req: Request, res: Response) => {
  const created = await createStaff(req.body);
  res.status(201).json({
    success: true,
    data: toStaffDto(created)
  });
});

export const getStaffMember = asyncHandler(async (req: Request, res: Response) => {
  const id = parsePositiveIntParam(req.params.id);
  const staff = await getStaffById(id);
  res.status(200).json({
    success: true,
    data: toStaffDetailDto(staff)
  });
});

export const putStaff = asyncHandler(async (req: Request, res: Response) => {
  const id = parsePositiveIntParam(req.params.id);
  const updated = await updateStaff(id, req.body);
  res.status(200).json({
    success: true,
    data: toStaffDto(updated)
  });
});

export const deleteStaffMember = asyncHandler(async (req: Request, res: Response) => {
  const id = parsePositiveIntParam(req.params.id);
  await deleteStaff(id);
  res.status(204).send();
});
