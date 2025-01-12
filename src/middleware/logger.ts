import { NextFunction, Request, Response } from "express";

// Middleware to log request details
const logger = (req: Request, res: Response, next: NextFunction) => {
  // Log the request method, URL, and timestamp when the request is received
  console.log(
      `Received ${req.method} on ${req.url} at ${new Date().toLocaleString()}`
  );

  // Pass control to the next middleware or route handler
  next();
};

export default logger;
