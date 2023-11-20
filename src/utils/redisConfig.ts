/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from "redis";

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 14238,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

if (!client.isOpen) {
  client.connect();
}

export { client };
