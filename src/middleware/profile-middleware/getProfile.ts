import { NextFunction, Request, Response } from "express";
import { IAccessToken } from "../../types";
import mongoose from "mongoose";

// Middleware to validate and set the userId for fetching profile
const getProfileMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    // Extract the user information from the request
    const user = req.user as IAccessToken;
    const { id } = user;

    // Check if the provided userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        // If invalid, respond with a 403 Forbidden error
        res.status(403).send({
            success: false,
            message: `Invalid User ID: ${id}`,
            timestamp: res.locals.timestamp,
        });
        return;
    }

    // Set the userId in the request body for further use in the route
    req.body = {
        userId: id,
    };

    // Pass control to the next middleware or route handler
    next();
};

export default getProfileMiddleware;
