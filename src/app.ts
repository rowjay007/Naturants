/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
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
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
