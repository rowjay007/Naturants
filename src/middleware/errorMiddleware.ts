/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  console.error("❌ Error:", err);
  if (process.env.NODE_ENV === "development") {
    return res.status(500).json({
      status: "error",
      message: err.message,
      stack: err.stack,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
};

export default errorMiddleware;
