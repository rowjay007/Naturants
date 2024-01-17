/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import RedisService from "../utils/redisService";

let mongoServer: MongoMemoryServer;

// Mock RedisService
jest.mock("../utils/redisService");

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Mock the RedisService.getClient method
  (RedisService.getInstance as jest.Mock).mockReturnValue({
    getClient: jest.fn((_options) => {
      // Mocked Redis client logic
      return {}; // Adjust as per your needs
    }),
  });

  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  await mongoose.connect(mongoUri, mongooseOptions as any);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

test("Example test", () => {
  // Your test logic here, if needed
  expect(true).toBe(true);
});
