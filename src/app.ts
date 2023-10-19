/* eslint-disable @typescript-eslint/no-unused-vars */
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import { protect } from "./middleware/authMiddleware";
import naturantsRoutes from "./routes/naturantsRoutes";
import usersRoutes from "./routes/usersRoutes";
import reviewsRoutes from "./routes/reviewsRoutes";
import { AppError } from "./utils/appError";

dotenv.config();

const app = express();
const port =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_PORT
    : process.env.DEV_PORT;

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);

app.use(helmet());
app.use(express.json());

app.use(mongoSanitize());

app.use(
  hpp({
    checkQuery: false,
    checkBody: true,
    whitelist: ["whitelistedParam"],
  })
);

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms - :date[clf]"
  )
);

app.use(cors());

app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/naturants", protect, naturantsRoutes);
app.use("/api/v1/reviews", reviewsRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    console.error("❌ Error:", err);
    if (process.env.NODE_ENV === "development") {
      res.status(500).json({ error: err.message, stack: err.stack });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

export { app, port };
