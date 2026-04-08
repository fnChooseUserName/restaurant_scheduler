import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { AppError } from "../errors/AppError";

type ErrorResponse = {
  success: false;
  message: string;
  errors?: unknown;
};

/**
 * Terminal middleware: maps errors to HTTP responses. Order matters—check specific types
 * before the generic `Error` branch so validation (`ZodError`) and intentional HTTP errors
 * (`AppError`) are not misreported as 500s. Prisma unique violations (`P2002`) return 409
 * with a short client-safe message instead of a generic 500.
 */
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

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = error.meta?.target;
      const fields = Array.isArray(target) ? target.join(", ") : String(target ?? "");
      res.status(409).json({
        success: false,
        message: fields
          ? `A record already exists for: ${fields}`
          : "A record with this value already exists"
      });
      return;
    }
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
