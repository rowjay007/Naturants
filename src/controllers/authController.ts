/* eslint-disable @typescript-eslint/no-unused-vars */
// controllers/authController.ts

import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/usersModel";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password } = req.body;

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      throw new AppError("Username is already taken", 400);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      status: "success",
      data: { user: newUser },
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await UserModel.findOne({ username });

    if (!user) {
      throw new AppError("Invalid username or password", 401);
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new AppError("Invalid username or password", 401);
    }

    // Generate a token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "", {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      status: "success",
      data: { token },
    });
  }
);
