import { NextFunction, Request, Response } from "express";
import { EditableUserFieldsArray, IAccessToken, IEditableUserFields } from "../../types";

/**
 * Middleware to validate and sanitize the profile update payload.
 * Ensures only editable fields are processed and includes helpful error messages.
 */
const updateProfileMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // Extract the data payload from the request body
    const payload = req.body as {
        data: IEditableUserFields;
    };

    // Validate the payload structure
    if (!payload || !payload.data) {
         res.status(400).json({
            success: false,
            message: "No data provided for profile update.",
            timestamp: res.locals.timestamp,
        });
        return
    }

    // Retrieve the user information from the request object
    const user = req.user as IAccessToken;
    const { id } = user;

    const { data } = payload;

    // Check if the payload data is empty
    if (Object.keys(data).length === 0) {
         res.status(400).json({
            success: false,
            message: "Profile update data is empty. Please provide valid fields.",
            timestamp: res.locals.timestamp,
        });
        return
    }

    // Filter out fields that are not editable
    for (const key of Object.keys(data)) {
        if (!EditableUserFieldsArray.includes(key)) {
            delete data[key as keyof IEditableUserFields];
        }
    }

    // Update the request body with the sanitized payload
    req.body = {
        userId: id,
        data,
    };

    // Proceed to the next middleware or route handler
    next();
};

export default updateProfileMiddleware;
