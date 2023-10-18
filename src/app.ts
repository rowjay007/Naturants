/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit"; // Import express-rate-limit
import morgan from "morgan";
import { protect } from "./middleware/authMiddleware";
import naturantsRoutes from "./routes/naturantsRoutes";
import usersRoutes from "./routes/usersRoutes";
import { AppError } from "./utils/appError";

dotenv.config();

const app = express();
const port =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_PORT
    : process.env.DEV_PORT;

// Middleware to set common response headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// Apply rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.use(express.json());

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms - :date[clf]"
  )
);

app.use(cors());

// Protect these routes
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/naturants", protect, naturantsRoutes);

// Custom error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    console.error("❌ Error:", err);
    if (process.env.NODE_ENV === "development") {
      // In development, send detailed error information
      res.status(500).json({ error: err.message, stack: err.stack });
    } else {
      // In production, send a generic error message
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

export { app, port };
