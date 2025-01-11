import { NextFunction, Request, Response } from "express";

const greet = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: `Welcome to CRUDify!`,
    timestamp: new Date().toISOString(),
    details: {
      projectName: "CRUDify",
      version: "1.0.0",
      author: "Faisal (FHackker)",
      description: "A user management system with authentication and authorization features.",
      repository: "https://github.com/FHackker/CRUDify_backend", // Example link
    },
  });
};

const greetName = (req: Request, res: Response, next: NextFunction) => {
  const name = req.params.name;
  res.status(200).json({
    success: true,
    message: `Hello ${name.trim()}, Welcome to CRUDify!`,
   timestamp: new Date().toISOString(),
    details: {
      projectName: "CRUDify",
      version: "1.0.0",
      author: "Faisal (FHackker)",
      description: "A user management system with authentication and authorization features.",
      repository: "https://github.com/FHackker/CRUDify_backend", // Example link
    },
  });
};

export { greet, greetName };
