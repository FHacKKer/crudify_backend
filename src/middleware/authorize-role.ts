import { NextFunction, Request, Response } from "express";

/**
 * Middleware to authorize users based on their roles.
 * @param requiredRole - An array of roles allowed to access the route.
 * @returns A middleware function to validate the user's role.
 */
const authorizeRole = (requiredRole: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Extract the user's role from the request body
    const userRole = req.body?.role;

    // Check if the user role is not provided
    if (!userRole) {
      res.status(403).json({
        success: false,
        message: "Access denied: Please Login First!",
        timestamp: res.locals.timestamp,
      });
      return; // Stop further processing
    }

    // Check if the user's role is not in the list of allowed roles
    if (!requiredRole.includes(userRole)) {
      res.status(403).json({
        success: false,
        message: "Access denied: Insufficient permissions",
        timestamp: res.locals.timestamp,
      });
      return; // Stop further processing
    }

    // If the user has a valid role, proceed to the next middleware or route handler
    next();
  };
};

export default authorizeRole;
