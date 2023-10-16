// errorController.ts

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { AppError, ValidationError } from "../utils/appError";

// Handle validation errors 🚫
export const handleValidationErrors = (
  err: ValidationError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(err.statusCode).json({ error: err.message });
};

// Handle MongoDB duplicate key errors 🔄
const handleDuplicateKeyError = (err: any): AppError => {
  const keyValueMatch = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  const key = keyValueMatch ? keyValueMatch[0] : "unknown";
  const message = `Duplicate field value: ${key}`;
  return new AppError(message, 400);
};

// Handle MongoDB validation errors 🔍
const handleMongoValidationError = (err: any): AppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// Handle MongoDB CastError (invalid ObjectId) 🆘
const handleCastError = (): AppError => {
  const message = "Invalid resource ID";
  return new AppError(message, 400);
};

// Handle JWT errors 🚫
const handleJWTError = (): AppError => {
  return new AppError("Invalid token. Please log in again.", 401);
};

// Handle operational errors during development 🚧
const handleDevErrors = (err: any, res: Response): void => {
  console.error("🚧 [Development Error]:", err);
  res.status(err.statusCode).json({
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Handle operational errors during production 🚨
const handleProdErrors = (err: AppError, res: Response): void => {
  if (err.isOperational) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    console.error("🚨 [ERROR]:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (process.env.NODE_ENV === "development") {
    handleDevErrors(err, res);
  } else {
    let error: AppError;

    if (err.code === 11000) {
      error = handleDuplicateKeyError(err);
    } else if (err.name === "ValidationError") {
      error = handleMongoValidationError(err);
    } else if (err.name === "CastError") {
      error = handleCastError();
    } else if (err.name === "JsonWebTokenError") {
      error = handleJWTError();
    } else {
      error = new AppError("Something went wrong", 500);
    }

    handleProdErrors(error, res);
  }
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  handleError(err, req, res, next);
};
