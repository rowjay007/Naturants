// app.ts

import express from "express";
import morgan from "morgan";
import naturantsRoutes from "./routes/naturantsRoutes";
import usersRoutes from "./routes/usersRoutes";

const app = express();
const PORT = 3001;

app.use(express.json());

// Middleware for logging
app.use(morgan("dev"));

// Middleware for handling errors
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
);

app.use("/api/v1/users", usersRoutes); // Mount usersRoutes at /api/v1/users
app.use("/api/v1/naturants", naturantsRoutes); // Mount naturantsRoutes at /api/v1/naturants

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running on port ${PORT}`);
});
