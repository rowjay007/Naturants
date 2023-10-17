/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/usersModel";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
import { sendEmail } from "../utils/email";

const signToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "", {
    expiresIn: process.env.TOKEN_EXPIRE,
  });
};

const createSendToken = (
  user: any,
  statusCode: number,
  res: Response
): void => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: "success",
    data: { user, token },
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

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, email, password, passwordConfirm, role } = req.body;

    // Check if the password and confirmPassword match
    if (password !== passwordConfirm) {
      throw new AppError("Passwords do not match", 400);
    }

    // Check if the password meets the minimum requirements
    if (!isPasswordValid(password)) {
      throw new AppError(
        "Password does not meet the minimum requirements",
        400
      );
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

    createSendToken(newUser, 201, res);
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
    const isPasswordCorrect = await bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
      throw new AppError("Invalid username or password", 401);
    }

    createSendToken(user, 200, res);
  }
);

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email } = req.body;

    // Find user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new AppError("User not found with this email address", 404);
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save({ validateBeforeSave: false });

    // Send the reset token via email
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/reset-password/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.`;

    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { token, password, confirmPassword } = req.body;

    // Check if token is provided
    if (!token) {
      throw new AppError("Token is required for password reset", 400);
    }

    // Check if the password meets the minimum requirements
    if (!isPasswordValid(password)) {
      throw new AppError(
        "Password does not meet the minimum requirements",
        400
      );
    }

    // Hash the token provided during the reset password request
    const hashedTokenProvided = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find the user by the hashed reset token and ensure it's not expired
    const user = await UserModel.findOne({
      passwordResetToken: hashedTokenProvided,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError("Token is invalid or has expired", 400);
    }

    // Set new password only if passwords match
    if (password !== confirmPassword) {
      throw new AppError("Passwords do not match", 400);
    }

    // Check if the new password is the same as the previous one
    if (await user.comparePassword(password)) {
      throw new AppError(
        "Cannot use the same password as the previous one",
        400
      );
    }

    // Update the user's password and clear reset token fields
    user.password = password;
    user.passwordConfirm = confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Save the updated user with the new password
    await user.save();

    createSendToken(user, 200, res);
  }
);

// Function to check if password meets minimum requirements
const isPasswordValid = (password: string): boolean => {
  // Add your minimum requirements logic here
  // For example, check if the password has minimum length, contains uppercase, lowercase, and special characters, etc.

  // For simplicity, let's assume a minimum length of 8 characters
  return password.length >= 8;
};

export const deleteProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Assuming user information is stored in req.user
    const user = req.user;

    // Delete the user profile
    await UserModel.findByIdAndDelete(user._id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
