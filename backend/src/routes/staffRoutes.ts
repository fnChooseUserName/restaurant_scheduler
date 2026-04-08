import { Router } from "express";

import {
  deleteStaffMember,
  getStaffList,
  getStaffMember,
  postStaff,
  putStaff
} from "../controllers/staffController";
import { validateRequest } from "../middleware/validateRequest";
import { createStaffSchema, updateStaffSchema } from "../validators/staffValidator";

const staffRoutes = Router();

staffRoutes.get("/", getStaffList);
staffRoutes.post("/", validateRequest(createStaffSchema), postStaff);
staffRoutes.get("/:id", getStaffMember);
staffRoutes.put("/:id", validateRequest(updateStaffSchema), putStaff);
staffRoutes.delete("/:id", deleteStaffMember);

export { staffRoutes };
