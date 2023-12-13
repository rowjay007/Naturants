/* eslint-disable @typescript-eslint/no-explicit-any */
import winston, { createLogger, format, transports } from "winston";

const { combine, timestamp, errors, splat, json } = format;

class Logger {
  private static instance: Logger;
  private logger: winston.Logger;

  private constructor() {
    const logFormat = combine(
      timestamp(),
      errors({ stack: true }),
      splat(),
      json()
    );

    this.logger = createLogger({
      level: "info",
      format: logFormat,
      transports: [
        new transports.Console(),
        new transports.File({ filename: "error.log", level: "error" }),
        new transports.File({ filename: "combined.log" }),
      ],
    });
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public info(message: string, data?: any): void {
    this.logger.log("info", message, data);
  }

  public error(message: string, data?: any): void {
    this.logger.log("error", message, data);
  }

  public warn(message: string, data?: any): void {
    this.logger.log("warn", message, data);
  }
  public log(level: string, message: string, data?: any): void {
    this.logger.log(level, message, data);
  }
}

export default Logger.getInstance();
