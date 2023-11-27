// appError.ts

class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, true);
  }
}

export { AppError, ValidationError };
