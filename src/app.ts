/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from "cors";
import express from "express";
import morgan from "morgan";
import naturantsRoutes from "./routes/naturantsRoutes";
import usersRoutes from "./routes/usersRoutes";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/naturants", naturantsRoutes);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  }
);

export { app, port };
