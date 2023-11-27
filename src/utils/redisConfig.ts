import dotenv from "dotenv";
import RedisService from "./redisService";

// Load environment variables from .env file
dotenv.config();

const redisConfig = RedisService.getInstance({
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6379"),
});

export default redisConfig;
