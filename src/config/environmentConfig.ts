// config.ts

import dotenv from "dotenv";

dotenv.config();

const env = process.env.NODE_ENV || "development";

const serverPort =
  env === "production" ? process.env.PROD_PORT : process.env.DEV_PORT;

export { serverPort };
