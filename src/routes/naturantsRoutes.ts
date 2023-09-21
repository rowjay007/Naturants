// routes/naturantsRoutes.ts

import express from "express";
import { readFile, writeFile } from "fs/promises";

const router = express.Router();

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

// Middleware to read naturant data
async function readNaturantData() {
  const naturantData = await readFile(
    "src/data/naturants-sample.json",
    "utf-8"
  );
  return JSON.parse(naturantData) as Naturant[];
}

// Controller to get all naturants
async function getAllNaturants(req: express.Request, res: express.Response) {
  try {
    const naturants = await readNaturantData();
    res.json({
      status: "success",
      data: naturants,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Controller to create a new naturant
async function createNaturant(req: express.Request, res: express.Response) {
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
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Controller to update a naturant by ID (PUT)
async function updateNaturantById(req: express.Request, res: express.Response) {
  try {
    const { id } = req.params;
    const updatedNaturant: Naturant = req.body;
    const naturants = await readNaturantData();

    const existingNaturantIndex = naturants.findIndex(
      (naturant) => naturant.id === parseInt(id)
    );

    if (existingNaturantIndex === -1) {
      res.status(404).json({ error: "Naturant not found" });
      return;
    }

    updatedNaturant.id = parseInt(id);
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
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Controller to delete a naturant by ID
async function deleteNaturantById(req: express.Request, res: express.Response) {
  try {
    const { id } = req.params;
    const naturants = await readNaturantData();

    const existingNaturantIndex = naturants.findIndex(
      (naturant) => naturant.id === parseInt(id)
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
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Controller to get a naturant by ID
async function getNaturantById(req: express.Request, res: express.Response) {
  try {
    const { id } = req.params;
    const naturants = await readNaturantData();

    const selectedNaturant = naturants.find(
      (naturant) => naturant.id === parseInt(id)
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
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Controller to update a naturant by ID (PATCH)
async function updateNaturantPartially(
  req: express.Request,
  res: express.Response
) {
  try {
    const { id } = req.params;
    const updatedFields: Partial<Naturant> = req.body;
    const naturants = await readNaturantData();

    const existingNaturantIndex = naturants.findIndex(
      (naturant) => naturant.id === parseInt(id)
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
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Define routes using the controller functions
router.get("/", getAllNaturants);
router.post("/", createNaturant);
router.get("/:id", getNaturantById);
router.put("/:id", updateNaturantById);
router.delete("/:id", deleteNaturantById);
router.patch("/:id", updateNaturantPartially);

export default router;
