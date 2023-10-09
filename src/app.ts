/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
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

// Catch-all route for unhandled routes
app.all("*", (req: Request, res: Response) => {
  res
    .status(404)
    .json({ status: "Failed", message: `Cannot find ${req.originalUrl} on this server` });
});

// Custom error handling middleware
// Custom error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error", details: err.message });
});


export { app, port };
 