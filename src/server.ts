import dotenv from "dotenv";
import mongoose from "mongoose";
import { app } from "./app";

dotenv.config(); // Load environment variables from .env file

const mongoUri = process.env.MONGO_URI?.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD || ""
);

const env = process.env.NODE_ENV || "development";
const serverPort =
  env === "production" ? process.env.PROD_PORT : process.env.DEV_PORT;

// Define mongoose options with type assertion
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions;

// Connect to MongoDB using Mongoose
mongoose
  .connect(mongoUri || "", mongooseOptions)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(serverPort, () => {
      console.log(`Server is listening on port ${serverPort}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
