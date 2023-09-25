/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import naturantsRoutes from "./routes/naturantsRoutes";
import usersRoutes from "./routes/usersRoutes";

const app = express();
const port = process.env.PORT || 3001;

// Middleware to set common response headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/naturants", naturantsRoutes);

// Custom error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

export { app, port };
