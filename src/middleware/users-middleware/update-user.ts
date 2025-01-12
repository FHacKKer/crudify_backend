import { Request, Response, NextFunction } from "express";
import { EditableUserFieldsArray, IAccessToken, IEditableUserFields, IUser } from "../../types";
import mongoose from "mongoose";
import { AppError } from "../../util/AppError";

/**
 * Middleware to validate and sanitize the payload for updating user information.
 * Ensures that only valid fields are provided and that the current user is authorized to update another user's data.
 */
export const updateUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Extracting the userId and data from the request body
    const payload = req.body as { userId: string, data: IEditableUserFields };
    const currentUser = req.user as IAccessToken;

    // Check if the userId is provided in the request body
    if (!payload || !payload.userId) {
        res.status(403).json({
            success: false,
            message: `Access denied: User ID is required to proceed. Please provide a valid User ID.`,
            timestamp: res.locals.timestamp
        });
        return; // Return early if the userId is missing
    }

    // Validate if the provided userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(payload.userId.toString().trim())) {
        throw new AppError(`Invalid user ID: "${payload.userId.toString().trim()}".`, 400); // Throw an error if the userId is invalid
    }

    // Prevent the current user from updating their own data
    if (currentUser.id === payload.userId) {
        res.status(400).json({
            success: false,
            message: "Oops! You can't update your own information here. Please visit your profile page to make changes.",
            timestamp: res.locals.timestamp
        });
        return; // Return early if the user is trying to update their own data
    }

    // Check if data is provided for updating fields
    if (!payload.data) {
        res.status(403).json({
            success: false,
            message: `Access denied: Please provide the fields you want to update.`,
            timestamp: res.locals.timestamp
        });
        return; // Return early if no data fields are provided
    }

    /*
    * Checking the length of data fields that the admin wants to change
    */
    const dataFieldsLength = Object.keys(payload.data).length;

    // If no fields are provided to update, return an error
    if (dataFieldsLength === 0) {
        res.status(403).json({
            success: false,
            message: `Access Denied: No fields to update were provided. Please include at least one valid field to modify.`,
            timestamp: res.locals.timestamp
        });
        return; // Return early if no fields are specified for update
    }

    // Remove any extra key-value pairs that aren't part of the editable fields
    for (const field of Object.keys(payload.data)) {
        if (!EditableUserFieldsArray.includes(field as keyof IEditableUserFields)) {
            delete payload.data[field as keyof IEditableUserFields]; // Remove invalid fields from the data object
        }
    }

    // Attach the sanitized userId and data to the request body for further processing
    req.body = {
        userId: payload.userId.toString().trim(),
        data: payload.data
    };

    // Proceed to the next middleware or route handler
    next();
};
