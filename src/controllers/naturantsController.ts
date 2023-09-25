/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { readFile, writeFile } from "fs/promises";

// Define Naturant interface here
interface Naturant {
  id: number;
  restaurantName: string;
  address: string;
  phone: string;
  menuItems: { itemName: string; price: number }[];
  employees: { employeeName: string; position: string }[];
  orders: any[];
  customers: any[];
}

// Param middleware to parse the 'id' parameter
export async function parseNaturantId(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const id = req.params.id;
  req.naturantId = parseInt(id, 10); // Store the parsed ID in request object
  next();
}

// Controller function to get all naturants
export async function getAllNaturants(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    // Implement code for getting all naturants
    const naturantData = await readFile(
      "src/data/naturants-sample.json",
      "utf-8"
    );
    const naturants: Naturant[] = JSON.parse(naturantData);

    res.json({
      status: "success",
      data: naturants,
    });
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
}

// Controller function to create a new naturant
export async function createNaturant(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const newNaturant: Naturant = req.body;
    const naturants = await readNaturantData();

    // Generate a unique ID for the new naturant
    const maxId = Math.max(...naturants.map((naturant) => naturant.id));
    newNaturant.id = maxId + 1;

    naturants.push(newNaturant);

    // Write the updated naturant data back to naturants-sample.json
    await writeFile(
      "src/data/naturants-sample.json",
      JSON.stringify(naturants, null, 2),
      "utf-8"
    );

    res.status(201).json({
      status: "success",
      data: newNaturant,
    });
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
}

// Controller function to get a naturant by ID
export async function getNaturantById(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { naturantId } = req;
    const naturants = await readNaturantData();

    const selectedNaturant = naturants.find(
      (naturant) => naturant.id === naturantId
    );

    if (!selectedNaturant) {
      res.status(404).json({ error: "Naturant not found" });
      return;
    }

    res.json({
      status: "success",
      data: selectedNaturant,
    });
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
}

// Controller function to update a naturant by ID
export async function updateNaturantById(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { naturantId } = req;
    const updatedNaturant: Naturant = req.body;
    const naturants = await readNaturantData();

    const existingNaturantIndex = naturants.findIndex(
      (naturant) => naturant.id === naturantId
    );

    if (existingNaturantIndex === -1) {
      res.status(404).json({ error: "Naturant not found" });
      return;
    }

    updatedNaturant.id = naturantId;
    naturants[existingNaturantIndex] = updatedNaturant;

    // Write the updated naturant data back to naturants-sample.json
    await writeFile(
      "src/data/naturants-sample.json",
      JSON.stringify(naturants, null, 2),
      "utf-8"
    );

    res.json({
      status: "success",
      data: updatedNaturant,
    });
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
}

// Controller function to delete a naturant by ID
export async function deleteNaturantById(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { naturantId } = req;
    const naturants = await readNaturantData();

    const existingNaturantIndex = naturants.findIndex(
      (naturant) => naturant.id === naturantId
    );

    if (existingNaturantIndex === -1) {
      res.status(404).json({ error: "Naturant not found" });
      return;
    }

    const deletedNaturant = naturants.splice(existingNaturantIndex, 1)[0];

    // Write the updated naturant data back to naturants-sample.json
    await writeFile(
      "src/data/naturants-sample.json",
      JSON.stringify(naturants, null, 2),
      "utf-8"
    );

    res.json({
      status: "success",
      data: deletedNaturant,
    });
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
}

// Controller function to partially update a naturant by ID
export async function updateNaturantPartially(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { naturantId } = req;
    const updatedFields: Partial<Naturant> = req.body;
    const naturants = await readNaturantData();

    const existingNaturantIndex = naturants.findIndex(
      (naturant) => naturant.id === naturantId
    );

    if (existingNaturantIndex === -1) {
      res.status(404).json({ error: "Naturant not found" });
      return;
    }

    const updatedNaturant = {
      ...naturants[existingNaturantIndex],
      ...updatedFields,
    };
    naturants[existingNaturantIndex] = updatedNaturant;

    // Write the updated naturant data back to naturants-sample.json
    await writeFile(
      "src/data/naturants-sample.json",
      JSON.stringify(naturants, null, 2),
      "utf-8"
    );

    res.json({
      status: "success",
      data: updatedNaturant,
    });
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
}

async function readNaturantData() {
  const naturantData = await readFile(
    "src/data/naturants-sample.json",
    "utf-8"
  );
  return JSON.parse(naturantData) as Naturant[];
}
