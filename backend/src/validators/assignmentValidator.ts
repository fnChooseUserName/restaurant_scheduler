import { z } from "zod";

export const assignStaffSchema = z.object({
  staffMemberId: z.coerce.number().int().positive()
});
