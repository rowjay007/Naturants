// setup.ts

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer;

export const setupDatabase = async () => {
  if (!mongoose.connection.readyState) {
    // Connection not established, create new connection
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  }
};

export const closeDatabase = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};
