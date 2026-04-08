import { Router } from "express";

import { getShifts, postShift } from "../controllers/shiftController";
import { validateRequest } from "../middleware/validateRequest";
import { createShiftSchema } from "../validators/shiftValidator";

const shiftRoutes = Router();

shiftRoutes.get("/", getShifts);
shiftRoutes.post("/", validateRequest(createShiftSchema), postShift);

export { shiftRoutes };
