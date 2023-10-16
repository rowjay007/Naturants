/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/usersModel";
import { AppError } from "../utils/appError";

const signToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "", {
    expiresIn: process.env.TOKEN_EXPIRE,
  });
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Check if the current user's role is allowed
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Permission denied", 403));
    }
    next();
  };
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, password, passwordConfirm, role } = req.body;

    // Check if the password and confirmPassword match
    if (password !== passwordConfirm) {
      throw new AppError("Passwords do not match", 400);
    }

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      throw new AppError("Username is already taken", 400);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user with the specified role
    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    // Generate a token for the newly signed up user
    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      data: { user: newUser, token },
    });
  } catch (error: any) {
    if (error.name === "ValidationError" && error.errors.password) {
      // Handling the specific case where password confirmation fails
      return next(new AppError(error.errors.password.message, 400));
    }

    console.error("Error in signup:", error);
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
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

    // Generate a token for the logged-in user
    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      data: { token },
    });
  } catch (error) {
    console.error("Error in login:", error);
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new AppError("User not found with this email address", 404);
    }

    // Generate a reset token
    const resetToken: string = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send the reset token via email (You need to implement this)

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token, password, confirmPassword } = req.body;

    const hashedToken = UserModel.hashPasswordResetToken(token);

    const user = await UserModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError("Token is invalid or has expired", 400);
    }

    if (password !== confirmPassword) {
      throw new AppError("Passwords do not match", 400);
    }

    // Set new password
    user.password = password;
    user.passwordConfirm = confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Generate a new token
    const newToken = signToken(user._id);

    res.status(200).json({
      status: "success",
      data: { token: newToken },
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    next(error);
  }
};

// Example usage of restrictTo middleware
export const deleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Assuming user information is stored in req.user
    const user = req.user;

    // Delete the user profile
    await UserModel.findByIdAndDelete(user._id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.error("Error in deleteProfile:", error);
    next(error);
  }
};
