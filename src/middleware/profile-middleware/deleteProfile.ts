import { Request, Response, NextFunction } from "express";
import { IAccessToken } from "../../types";
import mongoose from "mongoose";

// Middleware to validate and set the userId for profile deletion
const deleteProfileMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.user as IAccessToken;

    // Check if the provided userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        // If invalid, respond with a 403 Forbidden error
        res.status(403).send({
            success: false,
            message: `Invalid user with id "${userId}"`,
            timestamp: res.locals.timestamp,
        });
        return;
    }

    // Set the userId in the request body for further use in the route
    req.body = {
        userId: userId,
    };

    // Pass control to the next middleware or route handler
    next();
};

export default deleteProfileMiddleware;
