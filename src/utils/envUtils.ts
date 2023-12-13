// utils/envUtils.ts
import dotenv from "dotenv";
import sanitizeHtml from "sanitize-html";
import validator from "validator";

dotenv.config();

export const validateAndSanitize = (
  key: string,
  defaultValue: string = ""
): string => {
  const value = process.env[key] || defaultValue;

  if (key === "EMAIL_USERNAME" && !validator.isEmail(value)) {
    throw new Error(`Invalid ${key} format`);
  }

  return sanitizeHtml(value);
};
