import dotenv from "dotenv";
import { app } from "./app";

dotenv.config(); // Load environment variables from .env file

const env = process.env.NODE_ENV || "development";
const serverPort =
  env === "production" ? process.env.PROD_PORT : process.env.DEV_PORT;

app.listen(serverPort, () => {
  console.log(`Server is listening on port ${serverPort}`);
});
