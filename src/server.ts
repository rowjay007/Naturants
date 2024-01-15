import dotenv from "dotenv";
import mongoose from "mongoose";
import { app } from "./app";
import RedisService from "./utils/redisService";

dotenv.config();

const mongoUri = process.env.MONGO_URI?.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD || ""
);

const env = process.env.NODE_ENV || "development";
const serverPort =
  env === "production" ? process.env.PROD_PORT : process.env.DEV_PORT;

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions;

const redisConfig = RedisService.getInstance({
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6379"),
});

// Import the AppError class
import { AppError } from "./utils/appError";
import logger from "./utils/logger";

// ...

mongoose
  .connect(mongoUri || "", mongooseOptions)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // Check if Redis is ready
    redisConfig.getClient().on("ready", () => {
      console.log("🔄 Redis is running");
    });

    app.listen(serverPort, () => {
      console.log(`🚀 Server is listening on port ${serverPort}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error connecting to MongoDB:", error);

    // Log the error using your logger
    logger.error("Error connecting to MongoDB", { error: error.stack });

    // If the error is critical, terminate the application
    if (error instanceof AppError && error.isOperational) {
      console.error("Critical error. Terminating the application.");
      process.exit(1);
    }
  });
