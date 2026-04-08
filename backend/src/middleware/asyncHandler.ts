import { NextFunction, Request, RequestHandler, Response } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * Wraps an async Express handler so rejected promises and thrown errors reach Express’s
 * error-handling pipeline via `next(err)`. Without this, async handlers can fail silently
 * or produce unhandled rejections because Express does not await returned promises.
 */
export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req, res, next) => {
    void Promise.resolve(fn(req, res, next)).catch(next);
  };
};
