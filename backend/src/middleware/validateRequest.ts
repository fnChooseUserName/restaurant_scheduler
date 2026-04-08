import { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodType } from "zod";

export const validateRequest = <T>(schema: ZodType<T>): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(result.error);
      return;
    }

    req.body = result.data;
    next();
  };
};
