/* eslint-disable @typescript-eslint/no-unused-vars */
// controllers/naturantsController.ts
import express from "express";
import NaturantsModel from "../models/naturantsModel";
import { ApiFeatures } from "../utils/apiFeatures";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";

export const parseNaturantId = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const id = req.params.id;
    req.naturantId = id;
    next();
  }
);

export const getAllNaturants = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(NaturantsModel.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const naturantsData = await features.query;

  res.json({
    status: "success",
    results: naturantsData.length,
    data: { naturantsData },
  });
});

export const createNaturant = catchAsync(async (req, res, next) => {
  const newNaturant = new NaturantsModel(req.body);
  const savedNaturant = await newNaturant.save();
  res.status(201).json({
    status: "success",
    data: savedNaturant,
  });
});

export const getNaturantById = catchAsync(async (req, res, next) => {
  const { naturantId } = req;
  const selectedNaturant = await NaturantsModel.findById(naturantId);

  if (!selectedNaturant) {
    throw new AppError("Naturant not found", 404);
  }

  res.json({
    status: "success",
    data: selectedNaturant,
  });
});

export const updateNaturantById = catchAsync(async (req, res, next) => {
  const { naturantId } = req;
  const updatedNaturant = req.body;
  const updatedDoc = await NaturantsModel.findByIdAndUpdate(
    naturantId,
    updatedNaturant,
    {
      new: true,
    }
  );

  if (!updatedDoc) {
    throw new AppError("Naturant not found", 404);
  }

  res.json({
    status: "success",
    data: updatedDoc,
  });
});

export const deleteNaturantById = catchAsync(async (req, res, next) => {
  const { naturantId } = req;
  const deletedNaturant = await NaturantsModel.findByIdAndRemove(naturantId);

  if (!deletedNaturant) {
    throw new AppError("Naturant not found", 404);
  }

  res.json({
    status: "success",
    data: deletedNaturant,
  });
});

export const updateNaturantPartially = catchAsync(async (req, res, next) => {
  const { naturantId } = req;
  const updatedFields = req.body;
  const updatedDoc = await NaturantsModel.findByIdAndUpdate(
    naturantId,
    { $set: updatedFields },
    { new: true }
  );

  if (!updatedDoc) {
    throw new AppError("Naturant not found", 404);
  }

  res.json({
    status: "success",
    data: updatedDoc,
  });
});

export const getTopNaturants = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    if (req.params.id === "top") {
      const topNaturantsData = await NaturantsModel.find()
        .sort({ rating: -1 })
        .limit(5);

      res.json({
        status: "success",
        results: topNaturantsData.length,
        data: { topNaturantsData },
      });
    } else {
      throw new AppError("Invalid parameter", 400);
    }
  }
);

// Middleware for handling undefined routes
export const handleUndefinedRoutes = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404, true));
};

export const undefinedRouteMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const error = new AppError(`Route not found: ${req.originalUrl}`, 404, true);
  next(error);
};
