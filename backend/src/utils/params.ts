import { AppError } from "../errors/AppError";

/**
 * Normalizes route params (Express may type them as `string | string[]`) into a positive
 * integer suitable for Prisma `where: { id }`. Throws `AppError` 400 on invalid input so
 * bad ids never reach the database as `NaN` or zero.
 */
export const parsePositiveIntParam = (raw: string | string[]): number => {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) {
    throw new AppError("Invalid id parameter", 400);
  }
  return n;
};
