import express from "express";
import { readFile } from "fs/promises";

const app = express();
const PORT = 3001;

app.use(express.json());

const dataPath = "src/data/naturants-sample.json"; // Assuming your data file is in the src/data directory

interface Naturant {
  id: number;
  // Add other properties here as needed
}

// Refactor the code to use an Express router
const router = express.Router();

// Define a route with a URL parameter
router.get("/api/v1/naturants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const rawData = await readFile(dataPath, "utf-8");
    const naturants: Naturant[] = JSON.parse(rawData); // Annotate the type here
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

// Define a route to handle GET requests to /api/v1/naturants without an id parameter
router.get("/api/v1/naturants", async (req, res) => {
  try {
    const rawData = await readFile(dataPath, "utf-8");
    const naturants: Naturant[] = JSON.parse(rawData);

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

// Mount the router on the main Express app
app.use("/", router);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running on port ${PORT}`);
});
