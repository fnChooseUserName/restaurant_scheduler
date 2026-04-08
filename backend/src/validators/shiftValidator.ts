import { z } from "zod";

const isoDateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected ISO date (YYYY-MM-DD)")
  .refine((s) => !Number.isNaN(Date.parse(`${s}T00:00:00.000Z`)), "Invalid date");

const hhmm = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Expected HH:MM (24-hour)");

export const createShiftSchema = z.object({
  day: isoDateString,
  startTime: hhmm,
  endTime: hhmm,
  role: z.enum(["SERVER", "COOK", "MANAGER", "HOST", "BARTENDER"])
});

export const updateShiftSchema = createShiftSchema.partial();
