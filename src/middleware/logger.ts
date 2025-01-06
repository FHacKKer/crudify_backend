import { NextFunction, Request, Response } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(
    `Received ${req.method} on ${req.url} at ${new Date().toLocaleString()}`
  );

  next();
};

export default logger;
