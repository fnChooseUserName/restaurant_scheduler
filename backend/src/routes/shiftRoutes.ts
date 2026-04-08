import { Router } from "express";

import {
  deleteShiftAssign,
  deleteShiftMember,
  getShiftByIdHandler,
  getShifts,
  postShift,
  postShiftAssign,
  putShift
} from "../controllers/shiftController";
import { validateRequest } from "../middleware/validateRequest";
import { assignStaffSchema } from "../validators/assignmentValidator";
import { createShiftSchema, updateShiftSchema } from "../validators/shiftValidator";

const shiftRoutes = Router();

shiftRoutes.get("/", getShifts);
shiftRoutes.post("/", validateRequest(createShiftSchema), postShift);
shiftRoutes.post(
  "/:id/assign",
  validateRequest(assignStaffSchema),
  postShiftAssign
);
shiftRoutes.delete("/:id/assign/:staffId", deleteShiftAssign);
shiftRoutes.get("/:id", getShiftByIdHandler);
shiftRoutes.put("/:id", validateRequest(updateShiftSchema), putShift);
shiftRoutes.delete("/:id", deleteShiftMember);

export { shiftRoutes };
