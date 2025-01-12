import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { IAccessToken } from "../../types";

/**
 * Middleware to handle validation and preparation of user deletion request.
 * Ensures that userId is valid, belongs to another user, and is formatted correctly.
 */
function deleteUserMiddleware(req: Request, res: Response, next: NextFunction) {
    // Extracting the userId from the request body
    const payload = req.body as { userId: string };

    // Check if userId is provided in the request body
    if (!payload || !payload.userId) {
        res.status(400).send({
            success: false,
            message: "Oops! We couldn't find the user ID. Please provide a valid user ID and try again.",
            timestamp: res.locals.timestamp,
        });
        return; // Return early if the userId is missing
    }

    const { userId } = payload;

    // Validate if the provided userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).send({
            success: false,
            message: `The provided User ID "${userId}" is not valid. Please check and try again.`,
            timestamp: res.locals.timestamp,
        });
        return; // Return early if the userId is not valid
    }

    // Check if the userId belongs to the current user (prevent self-deletion)
    const { id: currentUserId } = req.user as IAccessToken;

    if (userId === currentUserId) {
        res.status(400).send({
            success: false,
            message: "You cannot delete your own account from this page. Please visit your profile settings to manage your account.",
            timestamp: res.locals.timestamp,
        });
        return; // Return early if the user is trying to delete their own account
    }

    // Trim the userId and attach it back to the request body for further processing
    req.body = {
        userId: userId.toString().trim()
    };

    // Pass control to the next middleware or route handler
    next();
}

export default deleteUserMiddleware;
