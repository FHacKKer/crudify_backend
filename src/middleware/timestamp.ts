import { NextFunction, Request, Response } from "express";

// Middleware to add timestamp to all responses
const timeStampMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.timestamp = new Date().toISOString();

  next();
};

export default timeStampMiddleware;
