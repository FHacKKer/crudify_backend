import { NextFunction, Request, Response } from "express";
import { AppError } from "../util/AppError";

/**
 * Global Error Handling Middleware
 * Handles application-specific and generic errors consistently.
 *
 * @param err - The error object, expected to be an instance of AppError.
 * @param req - The incoming HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function (not used but required for the middleware signature).
 */
const ErrorHandlerMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set the HTTP status code and error message
  const statusCode = err.statusCode || 500; // Default to 500 (Internal Server Error) if no specific status is set
  const message = err.message || "Something went wrong! Please try again."; // Default error message

  // Send a structured JSON response with error details
  res.status(statusCode).json({
    success: false,
    message,
    timestamp: res.locals.timestamp,
  });
};

export default ErrorHandlerMiddleware;
