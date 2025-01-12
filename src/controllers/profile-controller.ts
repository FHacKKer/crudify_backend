import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/User-Model";
import { IEditableUserFields } from "../types";

/**
 * Controller to fetch user profile by user ID.
 */
export const getProfileController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body;

        // Find the user profile by ID and exclude the password field
        const userProfile = await UserModel.findById(userId).select("-password");

        // If no user profile is found, respond with an error
        if (!userProfile) {
             res.status(401).json({
                success: false,
                message: `Failed to fetch profile for User ID: ${userId}`,
                timestamp: res.locals.timestamp,
            });
            return
        }

        // Respond with the user profile
        res.status(200).json({
            success: true,
            profile: userProfile,
            message: "Profile retrieved successfully!",
        });
    } catch (error) {
        // Pass any errors to the error handling middleware
        next(error);
    }
};

/**
 * Controller to update user profile.
 */
export const updateProfileController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.body as {
            userId: string;
            data: IEditableUserFields;
        };

        // Attempt to update the user's profile with the provided data
        const updatedUser = await UserModel.findByIdAndUpdate(payload.userId, payload.data, {
            new: true, // Return the updated document
        });

        // If no user is found to update, respond with an error
        if (!updatedUser) {
             res.status(401).json({
                success: false,
                message: `No user found with User ID: ${payload.userId}`,
            });
            return
        }

        // Respond with success message
        res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            timestamp: res.locals.timestamp,
        });
    } catch (error) {
        // Pass any errors to the error handling middleware
        next(error);
    }
};


/**
 * Controller to delete a user profile by user ID.
 */
export const deleteProfileController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body as { userId: string };

        // Check if the user profile exists
        const userProfile = await UserModel.findById(userId);
        if (!userProfile) {
             res.status(401).json({
                success: false,
                message: `No user found with User ID: ${userId}`,
                timestamp: res.locals.timestamp,
            });
            return
        }

        // Delete the user profile
        await UserModel.findByIdAndDelete(userId);

        // Respond with success
        res.status(200).json({
            success: true,
            message: "Profile deleted successfully!",
            timestamp: res.locals.timestamp,
        });
    } catch (error) {
        // Pass any errors to the error handling middleware
        next(error);
    }
};
