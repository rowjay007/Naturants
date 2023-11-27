/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/cache.ts

import redisConfig from "./redisConfig";

export const cacheUserData = async (
  userId: string,
  user: any
): Promise<void> => {
  await redisConfig.setAsync(`user:${userId}`, JSON.stringify(user));
};

export const getCachedUserData = async (
  userId: string
): Promise<any | null> => {
  const cachedUser = await redisConfig.getAsync(`user:${userId}`);
  return cachedUser ? JSON.parse(cachedUser) : null;
};
