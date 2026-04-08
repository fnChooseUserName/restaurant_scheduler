import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

type ErrorResponse = {
  success: false;
  message: string;
  errors?: unknown;
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
): void => {
  if (error instanceof ZodError) {
    res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: error.flatten().fieldErrors
    });
    return;
  }

  if (error instanceof Error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
};
