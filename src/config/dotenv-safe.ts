// config.ts
import dotenvSafe from "dotenv-safe";

dotenvSafe.config({
  example: ".env.example",
});

const env = process.env.NODE_ENV || "development";

const serverPort =
  env === "production" ? process.env.PROD_PORT : process.env.DEV_PORT;

export { serverPort };
