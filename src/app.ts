import express from "express";

const app = express();
const port = process.env.PORT || 3000;

// Define a basic route
app.get("/api/v1/naturants", (req, res) => {
  res.json({ message: "Welcome to Naturants API" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
