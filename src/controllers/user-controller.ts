import {NextFunction, Request, Response} from "express";
import {UserModel} from "../models/User-Model";
import {IAccessToken, IEditableUserFields, IUser, UserRole} from "../types";
import {AppError} from "../util/AppError";
import bcrypt from "bcrypt";

// function to mask users email for normal user
function maskData(users: IUser[], role: UserRole): IUser[] {
  if (role === "user") {
    const processedData = users.map((user) => {
      // Masking the email and username for "user" role to ensure privacy
      const maskedEmail =
          user.email.substring(0, 3) +
          `*`.repeat(10) +
          user.email.substring(user.email.length - 3);

      const maskedUsername =
          user.username.substring(0, 2) +
          `*`.repeat(5) +
          user.username.substring(user.username.length - 2);

      return {
        name: user.name,
        username: maskedUsername,
        email: maskedEmail,
        isActive: user.isActive,
        _id: user.id,
        role: user.role,
        createdAt: user.createdAt,
      } as IUser;
    });

    return processedData;
  }

  return users;
}

// Controller for get users route
export const getUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role: userRole, id: currentUserId } = req.user as IAccessToken;

    // Retrieving users from database excluding the current user
    const rawUsers = await UserModel.find({
      _id: {
        $ne: currentUserId,
      },
    }).select("id name username email isActive role createdAt");

    // If no users found, return an empty array
    if (rawUsers.length === 0) {
      res.json({
        success: true,
        message: "User Fetched Successfully!",
        users: [],
      });
      return;
    }

    let maskedUsers: IUser[] = [];
    if (userRole === "user") {
      // Mask user email for "user" role client
      maskedUsers = maskData(rawUsers, userRole);
    }

    // Returning users data (masked for "user" role)
    res.status(200).json({
      timestamp: res.locals.timestamp,
      success: true,
      message: "User Fetched Successfully!",
      users: userRole === "user" ? maskedUsers : rawUsers,
    });
  } catch (error) {
    // Handling error and passing it to the next middleware
    const message =
        error instanceof Error ? error.message : JSON.stringify(error);
    next(new AppError(message, 400));
  }
};

// Controller for updating user profile
export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, data: dataFields } = req.body as { userId: string; data: IEditableUserFields };

    // Attempting to update the user in the database
    const updatedUser = await UserModel.findByIdAndUpdate(userId, dataFields, { new: true }).exec();

    // If user is not found, throw an error
    if (!updatedUser) {
      throw new AppError(`User not found with ID: "${userId}".`, 404);
    }

    // Responding with success message and updated fields
    res.status(200).json({
      success: true,
      message: `Updated fields for user "${updatedUser?.name || "John Doe"}": ${Object.keys(dataFields).join(", ")}.`,
      timestamp: res.locals.timestamp,
    });
  } catch (e) {
    // Passing error to error handling middleware
    next(e);
  }
};

// Controller for creating a new user
export const createUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: IUser = req.body;

    // Hashing the user's password before saving
    user.password = await bcrypt.hash(user.password, 10);

    // Creating a new user document and saving it to the database
    const newUser = new UserModel(user);
    await newUser.save();

    // Responding with success message and created user data
    res.status(201).json({
      success: true,
      message: `New User Created Successfully!`,
      timestamp: res.locals.timestamp,
      user: newUser,
    });
  } catch (e) {
    // Handling errors during user creation and passing it to the error middleware
    next(e);
  }
};

// Controller for deleting a user profile
export const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;

    // Attempting to find and delete the user from the database
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    // If no user is found, return an error response
    if (!deletedUser) {
      res.status(400).json({
        success: false,
        message: "User not found with ID: " + userId,
        timestamp: res.locals.timestamp,
      });
      return;
    }

    // Responding with success after deleting the user
    res.status(200).json({
      success: true,
      message: `The user has been successfully deleted!`,
      timestamp: res.locals.timestamp,
    });
  } catch (e) {
    // Passing error to error handling middleware
    next(e);
  }
};
