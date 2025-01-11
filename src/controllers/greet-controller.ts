import { NextFunction, Request, Response } from "express";

const greet = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: `Welcome to CRUDify!`,
    time: new Date().toLocaleString(),
  });
};

const greetName = (req: Request, res: Response, next: NextFunction) => {
  const name = req.params.name;
  if (!name) {
    res.status(401).json({
      success: false,
      message: `Provide a name for name greet!`,
      time: new Date().toLocaleString(),
    });
    return;
  }
  res.status(200).json({
    success: true,
    message: `Hello ${name.trim()}, Welcome to CRUDify!`,
    time: new Date().toLocaleString(),
  });
};

export { greet, greetName };
