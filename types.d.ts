// types.d.ts

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      MONGO_URI: string;
      DEV_PORT: string;
      PROD_PORT: string;
      // Add other environment variables here
    }
  }

  namespace Express {
    interface Request {
      naturantId: number;
      updatedUser: number;
    }
  }
}

export {};
