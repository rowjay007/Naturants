/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcrypt";
import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
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
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Permission denied", 403));
    }
    next();
  };
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    req.user = user;

    next();
  } catch (error) {
    return next(new AppError("Invalid token - Please log in", 401));
  }
};

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, email, password, passwordConfirm, role } = req.body;

    if (password !== passwordConfirm) {
      throw new AppError("Passwords do not match", 400);
    }

    if (!isPasswordValid(password)) {
      throw new AppError(
        "Password does not meet the minimum requirements",
        400
      );
    }

    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      throw new AppError("Username is already taken", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

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
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
      throw new AppError("Invalid username or password", 401);
    }

    createSendToken(user, 200, res);
  }
);


export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new AppError("User not found with this email address", 404);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save({ validateBeforeSave: false });

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

    if (!token) {
      throw new AppError("Token is required for password reset", 400);
    }

    if (!isPasswordValid(password)) {
      throw new AppError(
        "Password does not meet the minimum requirements",
        400
      );
    }

    const hashedTokenProvided = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await UserModel.findOne({
      passwordResetToken: hashedTokenProvided,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError("Token is invalid or has expired", 400);
    }

    if (password !== confirmPassword) {
      throw new AppError("Passwords do not match", 400);
    }

    if (await user.comparePassword(password)) {
      throw new AppError(
        "Cannot use the same password as the previous one",
        400
      );
    }

    user.password = password;
    user.passwordConfirm = confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    createSendToken(user, 200, res);
  }
);

export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { currentPassword, newPassword, newPasswordConfirm } = req.body;

    const user = await UserModel.findById(req.user._id).select("+password");

    if (!user || !(await user.comparePassword(currentPassword))) {
      throw new AppError("Current password is incorrect", 401);
    }

    if (newPassword !== newPasswordConfirm) {
      throw new AppError("New passwords do not match", 400);
    }

    if (await user.comparePassword(newPassword)) {
      throw new AppError(
        "Cannot use the same password as the previous one",
        400
      );
    }

    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;
    await user.save();

    createSendToken(user, 200, res);
  }
);

const isPasswordValid = (password: string): boolean => {
  return password.length >= 8;
};

export const deleteProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user;

    await UserModel.findByIdAndDelete(user._id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
