/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import {
  globalErrorHandler,
  handleValidationErrors,
} from "./controllers/errorController";
import naturantsRoutes from "./routes/naturantsRoutes";
import usersRoutes from "./routes/usersRoutes";

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

app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/naturants", naturantsRoutes);

// Custom error handling middleware
app.use(handleValidationErrors);
app.use(globalErrorHandler);

export { app, port };
