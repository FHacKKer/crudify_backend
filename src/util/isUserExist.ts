import {UserModel} from "../models/User-Model";
import {AppError} from "./AppError";

/**
 * Checks if the username or email already exists in the database.
 * @param email - The email to check.
 * @param username - The username to check.
 * @returns Object indicating if the user exists and a corresponding message.
 */
export async function isUserExist(
    email: string,
    username: string
): Promise<{ exists: boolean; message: string }> {
    try {
        // Check if username exists
        const userByUsername = await UserModel.findOne({ username });
        if (userByUsername) {
            return { exists: true, message: "Username already exists." };
        }

        // Check if email exists
        const userByEmail = await UserModel.findOne({ email });
        if (userByEmail) {
            return { exists: true, message: "Email already exists." };
        }

        // If neither exists, return success
        return { exists: false, message: "Username and email are available." };
    } catch (error) {
        console.error("Error checking if user exists:", error);
        throw new AppError("Database query failed", 401);
    }
}