import { Request, Response, NextFunction } from "express";

// Custom interface extending the express Request interface
interface CustomRequest extends Request {
  userId?: number;
  
}

// Middleware to check if the 'id' parameter exists and is a valid number
export function checkID(req: CustomRequest, res: Response, next: NextFunction) {
  const id = req.params.id;
  if (id === undefined || isNaN(parseInt(id, 10))) {
    return res.status(400).json({ error: "Invalid ID parameter" });
  }
  req.userId = parseInt(id, 10); // Store the parsed ID in the request object
  next();
}

// Middleware to check the request body
export function checkBody(req: Request, res: Response, next: NextFunction) {
  if (!req.body) {
    return res.status(400).json({ error: "Request body is missing" });
  }
  next();
}
