import express from "express";
import { readFile, writeFile } from "fs/promises";
import morgan from "morgan";
const app = express();
const PORT = 3001;

app.use(express.json());
const morganMiddleware = morgan("dev");

// Use Morgan middleware for logging requests
app.use(morganMiddleware);

const dataPath = "src/data/naturants-sample.json";

interface Naturant {
  id: number;
  restaurantName: string;
  address: string;
  phone: string;
  menuItems: { itemName: string; price: number }[];
  employees: { employeeName: string; position: string }[];
  orders: any[]; // Define your orders and customers types as needed
  customers: any[];
}

const readData = async () => {
  const rawData = await readFile(dataPath, "utf-8");
  return JSON.parse(rawData) as Naturant[];
};

const writeData = async (data: Naturant[]) => {
  await writeFile(dataPath, JSON.stringify(data, null, 2), "utf-8");
};

// GET all naturants
app.get("/api/v1/naturants", async (req, res) => {
  try {
    const naturants = await readData();
    res.json({
      status: "success",
      length: naturants.length,
      data: naturants,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET a single naturant by ID
app.get("/api/v1/naturants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const naturants = await readData();
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
});

// POST a new naturant
app.post("/api/v1/naturants", async (req, res) => {
  try {
    const newNaturant: Naturant = req.body;
    const naturants = await readData();

    // Generate a unique ID for the new naturant
    const maxId = Math.max(...naturants.map((naturant) => naturant.id));
    newNaturant.id = maxId + 1;

    naturants.push(newNaturant);
    await writeData(naturants);

    res.status(201).json({
      status: "success",
      data: newNaturant,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT (replace) a naturant by ID
app.put("/api/v1/naturants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedNaturant: Naturant = req.body;
    const naturants = await readData();

    const existingNaturantIndex = naturants.findIndex(
      (naturant) => naturant.id === parseInt(id)
    );

    if (existingNaturantIndex === -1) {
      res.status(404).json({ error: "Naturant not found" });
      return;
    }

    naturants[existingNaturantIndex] = updatedNaturant;
    await writeData(naturants);

    res.json({
      status: "success",
      data: updatedNaturant,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PATCH (update) a naturant by ID
app.patch("/api/v1/naturants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates: Partial<Naturant> = req.body;
    const naturants = await readData();

    const existingNaturantIndex = naturants.findIndex(
      (naturant) => naturant.id === parseInt(id)
    );

    if (existingNaturantIndex === -1) {
      res.status(404).json({ error: "Naturant not found" });
      return;
    }

    const updatedNaturant = { ...naturants[existingNaturantIndex], ...updates };
    naturants[existingNaturantIndex] = updatedNaturant;
    await writeData(naturants);

    res.json({
      status: "success",
      data: updatedNaturant,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE a naturant by ID
app.delete("/api/v1/naturants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const naturants = await readData();

    const existingNaturantIndex = naturants.findIndex(
      (naturant) => naturant.id === parseInt(id)
    );

    if (existingNaturantIndex === -1) {
      res.status(404).json({ error: "Naturant not found" });
      return;
    }

    const deletedNaturant = naturants.splice(existingNaturantIndex, 1)[0];
    await writeData(naturants);

    res.json({
      status: "success",
      data: deletedNaturant,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running on port ${PORT}`);
});
