/* eslint-disable @typescript-eslint/no-unused-vars */
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import expectCt from "expect-ct";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import {
  collectDefaultMetrics,
  Registry,
  Counter,
  register,
} from "prom-client"; // Import prom-client
import promBundle from "express-prom-bundle";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import naturantsRoutes from "./routes/naturantsRoutes";
import reviewsRoutes from "./routes/reviewsRoutes";
import usersRoutes from "./routes/usersRoutes";
import { AppError } from "./utils/appError";
import logger from "./utils/logger";

dotenv.config();

const app = express();
const port =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_PORT
    : process.env.DEV_PORT;

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader("Content-Type", "application/json");
    next();
  }
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);

app.use(
  helmet({
    contentSecurityPolicy: false,
    referrerPolicy: { policy: "same-origin" },
  })
);

app.use(
  expectCt({
    enforce: true,
    maxAge: 30,
  })
);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["https://fonts.gstatic.com"],
      // Add other directives as needed
    },
  })
);

app.use(helmet.xContentTypeOptions());
app.use(helmet.xFrameOptions());
app.use(helmet.xXssProtection());

app.use(express.json());
app.use(mongoSanitize());

app.use(
  hpp({
    checkQuery: false,
    checkBody: true,
    whitelist: ["whitelistedParam"],
  })
);

app.use(morgan("combined"));

app.use(compression());

app.use(cors());

// Setup prom-client registry
const registry = new Registry();
// Collect default metrics
collectDefaultMetrics({ register: registry });

// Create promBundle middleware with custom registry
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  customLabels: {
    module: "metrics",
  },
  promRegistry: registry, // Use the custom registry
  promClient: {
    collectDefaultMetrics: {}, // Collect default metrics separately
  },
  buckets: [0.1, 0.3, 1.2, 5.0],
});

app.use(metricsMiddleware);

// Define and register a custom counter metric with custom labels
const customCounter = new Counter({
  name: "my_custom_counter",
  help: "Description of my custom counter",
  labelNames: ["method", "endpoint"], // Define custom labels
});
register.setDefaultLabels({ app: "your_application_name" }); // Set default labels

app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/naturants", naturantsRoutes);
app.use("/api/v1/reviews", reviewsRoutes);
app.use("/api/v1/naturants/:naturantId/reviews", reviewsRoutes);

// Metrics endpoint
app.get("/api/v1/metrics", (req, res) => {
  registry
    .metrics()
    .then((metrics) => {
      res.set("Content-Type", registry.contentType);
      // Increment custom counter
      customCounter.inc({ method: req.method, endpoint: req.originalUrl });
      res.send(metrics);
    })
    .catch((error) => {
      logger.error(`Error fetching metrics: ${error.message}`);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    logger.error(err.message, { error: err.stack });
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }

    if (process.env.NODE_ENV === "development") {
      return res.status(500).json({ error: err.message, stack: err.stack });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
);

export { app, port };
