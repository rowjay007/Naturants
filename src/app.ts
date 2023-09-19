import express from "express";
import { readFile } from "fs/promises";

const app = express();
const PORT = 3001;

app.use(express.json());

const dataPath = "src/data/naturants-sample.json"; // Assuming your data file is in the src/data directory

app.get("/api/v1/naturants", async (req, res) => {
  try {
    const rawData = await readFile(dataPath, "utf-8");
    const naturants = JSON.parse(rawData);

    const response = {
      status: "success",
      length: naturants.length,
      data: naturants,
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running on port ${PORT}`);
});
