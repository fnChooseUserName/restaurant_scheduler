import { Router } from "express";

import { getStaff, postStaff } from "../controllers/staffController";
import { validateRequest } from "../middleware/validateRequest";
import { createStaffSchema } from "../validators/staffValidator";

const staffRoutes = Router();

staffRoutes.get("/", getStaff);
staffRoutes.post("/", validateRequest(createStaffSchema), postStaff);

export { staffRoutes };
