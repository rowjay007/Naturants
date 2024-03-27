/* eslint-disable @typescript-eslint/no-explicit-any */
// types.d.ts

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      MONGO_URI: string;
      DEV_PORT: string;
      PROD_PORT: string;
    }
  }

  namespace Express {
    interface Request {
      naturantId: number | string;
      userId: number | string;
      updatedUser: number;
    }
  }

  namespace Express {
    interface Request {
      user?: any;
    }
  }
  
}

 declare module "xss-clean";

export {};
