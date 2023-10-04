/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { SortOrder } from "mongoose";
import NaturantsModel from "../models/naturantsModel";

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
    // Extract query parameters for filtering, sorting, field limiting, and pagination
    const {
      filterField,
      filterValue,
      sortField,
      sortOrder,
      fields,
      page,
      limit,
    } = req.query;

    // Build the filter options
    const filterOptions: Record<string, any> = {};
    if (filterField && filterValue) {
      filterOptions[filterField as string] = filterValue;
    }

    // Build the sorting options
    const sortOptions: Record<string, SortOrder> = {};
    if (sortField && sortOrder) {
      sortOptions[sortField as string] = sortOrder as SortOrder;
    }

    // Build the field limiting options
    const selectFields: string[] | undefined = Array.isArray(fields)
      ? fields.map((field) => field.toString()) // Make sure each element is a string
      : typeof fields === "string" // If it's a single string, convert it to an array
      ? [fields]
      : undefined;

    // Convert page and limit to numbers (default to 1 and 10 respectively)
    const pageNumber = page ? parseInt(page as string, 10) : 1;
    const limitNumber = limit ? parseInt(limit as string, 10) : 10;

    // Calculate the number of documents to skip
    const skip = (pageNumber - 1) * limitNumber;

    // Query the database with filtering, sorting, field limiting, and pagination options
    let query = NaturantsModel.find(filterOptions)
      .sort(sortOptions as any)
      .skip(skip)
      .limit(limitNumber);

    // Apply field limiting if selectFields is defined
    if (selectFields) {
      query = query.select(selectFields);
    }

    // Execute the query
    const naturantsData = await query.exec();

    // Send the response
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
