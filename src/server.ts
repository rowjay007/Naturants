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
  });

process.on("unhandledRejection", (reason, promise) => {
  console.error("🔥 Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception:", error);
  process.exit(1);
});
