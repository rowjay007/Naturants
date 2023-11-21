/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import UsersModel from "../models/usersModel";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
import redisConfig from "../utils/redisConfig";

export const me = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      return next(new AppError("User not authenticated", 401));
    }
    const userId = req.user._id;
    const user = await UsersModel.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);

export const updateCurrentUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, email } = req.body;

    const user = await UsersModel.findByIdAndUpdate(
      req.user._id,
      { username, email },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);
export const deleteCurrentUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user._id; // Use req.user._id

    console.log("Deleting user with ID:", userId);

    // Delete the user
    const deletedUser = await UsersModel.findByIdAndRemove(userId);

    if (!deletedUser) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: deletedUser,
    });
  }
);

export const parseUserId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;
  const userId = id || (req.user && req.user._id);

  console.log("ID from params:", id);
  console.log("UserID from user:", req.user && req.user._id);

  if (!userId) {
    return next(new AppError("User ID not provided", 400));
  }

  req.userId = userId;
  next();
};

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let cashedUsers: string | null = await redisConfig.getAsync("allusers");

    if (cashedUsers === null) {
      const usersData = await UsersModel.find({});

      // Ensure cashedUsers is assigned a non-null value
      cashedUsers = JSON.stringify(usersData);

      await redisConfig.setAsync("allusers", cashedUsers);
    }

    // Check again for null before using it
    if (cashedUsers === null) {
      return next(new AppError("Failed to retrieve users data", 500));
    }

    res.status(200).json({
      status: "success",
      results: JSON.parse(cashedUsers).length,
      data: { usersData: JSON.parse(cashedUsers) },
    });
  }
);



export const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const newUser = new UsersModel(req.body);
    const savedUser = await newUser.save();
    res.status(201).json({
      status: "success",
      data: savedUser,
    });
  }
);

export const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId } = req;
    const selectedUser = await UsersModel.findById(userId);

    if (!selectedUser) {
      return next(new AppError("User not found", 404));
    }

    res.json({
      status: "success",
      data: selectedUser,
    });
  }
);

export const updateUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId } = req;
    const updatedUser = req.body;
    const updatedDoc = await UsersModel.findByIdAndUpdate(userId, updatedUser, {
      new: true,
    });

    if (!updatedDoc) {
      return next(new AppError("User not found", 404));
    }

    res.json({
      status: "success",
      data: updatedDoc,
    });
  }
);

export const updateUserPartially = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId } = req;
    const updatedFields = req.body;
    const updatedDoc = await UsersModel.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedDoc) {
      return next(new AppError("User not found", 404));
    }

    res.json({
      status: "success",
      data: updatedDoc,
    });
  }
);

export const deleteUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId } = req;
    const deletedUser = await UsersModel.findByIdAndRemove(userId);

    if (!deletedUser) {
      return next(new AppError("User not found", 404));
    }

    res.json({
      status: "success",
      data: deletedUser,
    });
  }
);
