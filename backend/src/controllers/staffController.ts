import { Request, Response } from "express";

import { createStaff, listStaff } from "../services/staffService";

export const getStaff = async (_req: Request, res: Response): Promise<void> => {
  const staff = await listStaff();
  res.status(200).json({
    success: true,
    data: staff
  });
};

export const postStaff = async (req: Request, res: Response): Promise<void> => {
  const created = await createStaff(req.body);
  res.status(201).json({
    success: true,
    data: created
  });
};
