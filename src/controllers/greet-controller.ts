import { NextFunction, Request, Response } from "express";

// Function to send a welcome message for the base route
const greet = (req: Request, res: Response, next: NextFunction) => {
  // Responding with a welcome message and project details
  res.status(200).json({
    success: true,
    message: `Welcome to CRUDify!`,
    timestamp: new Date().toISOString(),
    details: {
      projectName: "CRUDify",
      version: "1.0.0",
      author: "Faisal (FHackker)",
      description: "A user management system with role-based access control, proper authentication, and authorization features.",
      repository: "https://github.com/FHackker/CRUDify_backend",
      documentation: "https://github.com/FHackker/CRUDify_backend#readme",
    },
  });
};

// Function to send a personalized greeting message for the route with a name
const greetName = (req: Request, res: Response, next: NextFunction) => {
  const name = req.params.name; // Extracting the name from the URL parameter

  // Responding with a personalized greeting message for the user
  res.status(200).json({
    success: true,
    message: `Hello ${name.trim()}, Welcome to CRUDify!`,
    timestamp: new Date().toISOString(),
    details: {
      projectName: "CRUDify",
      version: "1.0.0",
      author: "Faisal (FHackker)",
      description: "A user management system with role-based access control, proper authentication, and authorization features.",
      repository: "https://github.com/FHackker/CRUDify_backend",
      documentation: "https://github.com/FHackker/CRUDify_backend#readme",
    },
  });
};

// Exporting both functions for use in other parts of the application
export { greet, greetName };
