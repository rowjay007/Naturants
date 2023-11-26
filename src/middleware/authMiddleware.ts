/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError";

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized - Please log in", 401));
  }

  try {
    const tokenWithoutBearer = token.split(" ")[1];
    const decoded: any = jwt.verify(
      tokenWithoutBearer,
      process.env.JWT_SECRET || ""
    );

    // 3) Attach the user to the request object
    req.user = decoded;

    next();
  } catch (error) {
    return next(new AppError("Invalid token - Please log in", 401));
  }
};
