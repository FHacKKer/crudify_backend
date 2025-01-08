import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/User-Model";
import { AppError } from "../util/AppError";

// Controller for get users route
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // retreiving users query
    const users = await UserModel.find().select(
      "name username email isActive role"
    );

    // returning users
    res.status(200).json({
      timestamp: res.locals.timestamp,
      success: true,
      message: "User Fetched Successfully!",
      users,
    });
  } catch (error) {
    // getting error message if error is instance of Error class
    const message =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new AppError(message, 400);
  }
};
