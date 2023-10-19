/* eslint-disable @typescript-eslint/no-unused-vars */
// reviewsController.ts

import { Request, Response, NextFunction } from "express";
import ReviewModel from "../models/reviewsModel";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";

export const getAllReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const reviews = await ReviewModel.find();
    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: {
        reviews,
      },
    });
  }
);

export const getReviewById = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const review = await ReviewModel.findById(req.params.id);
    if (!review) {
      return next(new AppError("Review not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        review,
      },
    });
  }
);

export const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const review = await ReviewModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        review,
      },
    });
  }
);

export const updateReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const review = await ReviewModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!review) {
      return next(new AppError("Review not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        review,
      },
    });
  }
);

export const deleteReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const review = await ReviewModel.findByIdAndDelete(req.params.id);

    if (!review) {
      return next(new AppError("Review not found", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
