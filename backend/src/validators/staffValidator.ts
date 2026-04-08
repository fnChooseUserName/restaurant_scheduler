import { z } from "zod";

export const createStaffSchema = z.object({
  name: z.string().min(1),
  role: z.enum(["SERVER", "COOK", "MANAGER", "HOST", "BARTENDER"]),
  phone: z.string().optional(),
  email: z.string().email()
});

export const updateStaffSchema = createStaffSchema.partial();
