/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import {
  default as ReviewModel,
  default as ReviewsModel,
} from "../models/reviewsModel";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
import redisConfig from "../utils/redisConfig";

export const getAllReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let cashedReviews = await redisConfig.getAsync("allreviews");

    if (!cashedReviews) {
      const review = await ReviewModel.find();

      await redisConfig.setAsync("allreviews", JSON.stringify(review));

      cashedReviews = JSON.stringify(review);
    }
    res.status(200).json({
      status: "success",
      results: JSON.parse(cashedReviews).length,
      data: {
        reviews: JSON.parse(cashedReviews),
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
    const { naturantId, ...reviewData } = req.body;

    if (!naturantId) {
      return next(
        new AppError("Naturant ID is required for creating a review", 400)
      );
    }
    const userId = req.user?.id;

    try {
      const review = await ReviewsModel.create({
        user: userId,
        naturant: naturantId,
        ...reviewData,
      });

      await ReviewsModel.calculateAverageRating(naturantId);

      res.status(201).json({
        status: "success",
        data: {
          review,
        },
      });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return next(new AppError(error.message, 400));
      }
      return next(error);
    }
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

export const getReviewsForNaturant = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { naturantId } = req.params;
    let cachedReviews = await redisConfig.getAsync(`reviews:${naturantId}`);

    if (!cachedReviews) {
      const reviews = await ReviewModel.find({ naturant: naturantId });
      await redisConfig.setAsync(
        `reviews:${naturantId}`,
        JSON.stringify(reviews)
      );

      cachedReviews = JSON.stringify(reviews);
    }
    res.status(200).json({
      status: "success",
      results: JSON.parse(cachedReviews).length,
      data: {
        reviews: JSON.parse(cachedReviews),
      },
    });
  }
);
