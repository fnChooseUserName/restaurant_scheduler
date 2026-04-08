import { z } from "zod";

export const createShiftSchema = z.object({
  day: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  role: z.enum(["SERVER", "COOK", "MANAGER", "HOST", "BARTENDER"])
});
