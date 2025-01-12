import { Request, Response, NextFunction } from "express";
import { IUser } from "../../types";
import { validateUser } from "../../util/validate-user";
import { isUserExist } from "../../util/isUserExist";

async function createUserMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        // Extract user data from the request body
        const payload = req.body as IUser;

        // Check if required fields are missing in the request body
        if (!payload || !payload.name || !payload.username || !payload.email || !payload.password) {
            const requiredFields = ["name", "username", "email", "password"];
            res.status(400).json({
                success: false,
                message: `Bad Request: Following fields are required. ${requiredFields.join(", ")}.`,
                timestamp: res.locals.timestamp
            });
            return; // Stop further processing if fields are missing
        }

        // Validate the user data (e.g., correct format of email, username, etc.)
        const normalizedUserResult = validateUser(payload);
        if (!normalizedUserResult.success) {
            res.status(400).json({
                success: false,
                message: normalizedUserResult.message,
                timestamp: res.locals.timestamp
            });
            return; // Stop further processing if validation fails
        }

        // Destructure the validated user object
        const { user: validatedUser } = normalizedUserResult;

        // Check if the email or username already exists in the database
        const userExistenceResult = await isUserExist(validatedUser.email, validatedUser.username);
        if (userExistenceResult.exists) {
            res.status(400).json({
                success: false,
                message: userExistenceResult.message,
                timestamp: res.locals.timestamp
            });
            return; // Stop further processing if user already exists
        }

        // Add the validated user data to the request body for further processing
        req.body = validatedUser;

        // Proceed to the next middleware or route handler
        next();

    } catch (e) {
        // Pass any errors to the error handling middleware
        next(e);
    }
}

export default createUserMiddleware;
