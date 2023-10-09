// controllers/naturantsController.ts
import express from "express";
import NaturantsModel from "../models/naturantsModel";
import { ApiFeatures } from "../utils/apiFeatures";

export async function parseNaturantId(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const id = req.params.id;
  req.naturantId = id;
  next();
}

export async function getAllNaturants(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
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
  } catch (err) {
    console.error("Error in getAllNaturants:", err);
    next(err);
  }
}

export async function createNaturant(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const newNaturant = new NaturantsModel(req.body);
    const savedNaturant = await newNaturant.save();
    res.status(201).json({
      status: "success",
      data: savedNaturant,
    });
  } catch (err) {
    console.error("Error in createNaturant:", err);
    next(err);
  }
}

export async function getNaturantById(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { naturantId } = req;
    const selectedNaturant = await NaturantsModel.findById(naturantId);

    if (!selectedNaturant) {
      res.status(404).json({ error: "Naturant not found" });
      return;
    }

    res.json({
      status: "success",
      data: selectedNaturant,
    });
  } catch (err) {
    console.error("Error in getNaturantById:", err);
    next(err);
  }
}

export async function updateNaturantById(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { naturantId } = req;
    const updatedNaturant = req.body;
    const updatedDoc = await NaturantsModel.findByIdAndUpdate(
      naturantId,
      updatedNaturant,
      { new: true }
    );

    if (!updatedDoc) {
      res.status(404).json({ error: "Naturant not found" });
      return;
    }

    res.json({
      status: "success",
      data: updatedDoc,
    });
  } catch (err) {
    console.error("Error in updateNaturantById:", err);
    next(err);
  }
}

export async function deleteNaturantById(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { naturantId } = req;
    const deletedNaturant = await NaturantsModel.findByIdAndRemove(naturantId);

    if (!deletedNaturant) {
      res.status(404).json({ error: "Naturant not found" });
      return;
    }

    res.json({
      status: "success",
      data: deletedNaturant,
    });
  } catch (err) {
    console.error("Error in deleteNaturantById:", err);
    next(err);
  }
}

export async function updateNaturantPartially(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { naturantId } = req;
    const updatedFields = req.body;
    const updatedDoc = await NaturantsModel.findByIdAndUpdate(
      naturantId,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedDoc) {
      res.status(404).json({ error: "Naturant not found" });
      return;
    }

    res.json({
      status: "success",
      data: updatedDoc,
    });
  } catch (err) {
    console.error("Error in updateNaturantPartially:", err);
    next(err);
  }
}

export async function getTopNaturants(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    if (req.params.id === "top") {
      const topNaturantsData = await NaturantsModel.find()
        .sort({ rating: -1 })
        .limit(5);

      return res.json({
        status: "success",
        results: topNaturantsData.length,
        data: { topNaturantsData },
      });
    }

    res.status(400).json({ error: "Invalid parameter" });
  } catch (err) {
    console.error("Error in getTopNaturants:", err);
    next(err);
  }
}
