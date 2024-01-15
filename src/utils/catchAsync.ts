import { Request, Response, NextFunction } from "express";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const catchAsync = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
