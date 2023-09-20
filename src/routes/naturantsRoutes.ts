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

// Create a Naturant
router.post("/", async (req, res) => {
  try {
    const newNaturant: Naturant = req.body;

    // Read the naturant data from naturants-sample.json
    const naturantData = await readFile(
      "src/data/naturants-sample.json",
      "utf-8"
    );
    const naturants: Naturant[] = JSON.parse(naturantData);

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
});

// Get All Naturants
router.get("/", async (req, res) => {
  try {
    // Read the naturant data from naturants-sample.json
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
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a Naturant by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedNaturant: Naturant = req.body;
    const naturantData = await readFile(
      "src/data/naturants-sample.json",
      "utf-8"
    );
    const naturants: Naturant[] = JSON.parse(naturantData);

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
});

// Delete a Naturant by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const naturantData = await readFile(
      "src/data/naturants-sample.json",
      "utf-8"
    );
    const naturants: Naturant[] = JSON.parse(naturantData);

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
});

export default router;
