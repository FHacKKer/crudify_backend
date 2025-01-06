import { NextFunction, Request, Response } from "express";

const ErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = 500;
  const message = error.message || "Internal Server Error!";

  res.status(statusCode).json({
    success: false,
    message,
  });

  next();
};

export default ErrorHandler;
