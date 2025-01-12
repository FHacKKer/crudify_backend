import { NextFunction, Request, Response } from "express";

// Middleware to add timestamp to all responses
const timeStampMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  // Add current timestamp in ISO format to response locals
  res.locals.timestamp = new Date().toISOString();

  // Pass control to the next middleware or route handler
  next();
};

export default timeStampMiddleware;
