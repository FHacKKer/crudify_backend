import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UserModel } from "../models/User-Model";
import { IAccessToken, IRefreshToken, IUser } from "../types";
import { AppError } from "../util/AppError";

// Sign in controller for signin route
const signinController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // getting jwt secret key from env function
    const { JWT_SECRET } = env();

    // destructuring login(email/username) and password from request body
    const { login, password } = req.body;

    // initially setting user to null
    let user = null;

    // attempting to find the user by username first
    user = await UserModel.findOne({ username: login });

    if (!user) {
      // if no user found by username, search by email
      user = await UserModel.findOne({ email: login });
    }

    if (!user) {
      // if still no user found, send response indicating no account exists
      res.json({
        success: false,
        message:
          "No account found with the provided credentials. Please try again.",
        timestamp: res.locals.timestamp,
      });
      return;
    }

    // comparing the provided password with the stored hashed password
    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      // if passwords don't match, send response indicating incorrect password
      res.json({
        success: false,
        message:
          "The provided password is incorrect. Please double-check and try again.",
        timestamp: res.locals.timestamp,
      });
      // exit after sending error response
      return;
    }

    // creating JWT payload with user info
    const payload: IAccessToken = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    // generate JWT access token with 1 hour expiration
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    // set access token in cookies
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    // generate refresh token with 24 hours expiration
    const refreshToken = jwt.sign(
      {
        id: user.id,
      } as IRefreshToken,
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // set refresh token in cookies for client-side use
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only secure in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // set max age for 24 hours
    });

    // reset user object to null, no longer needed
    user = null;

    // return success response with access token
    res.status(200).json({
      success: true,
      message: `Logged In successfully!`,
      timestamp: res.locals.timestamp,
      token,
    });
  } catch (error) {
    // pass error to error handler middleware
    next(error);
  }
};

// Sign up controller for signup route
const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // extracting user object from request body
    const user: IUser = req.body;

    // hashing the user's password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // creating a new user object with hashed password
    const newUser = new UserModel({
      ...user,
      password: hashedPassword,
    });

    // saving the new user to the database
    await newUser.save();

    // return success response after user is created
    res.status(201).json({
      success: true,
      message: `Welcome aboard! Your account has been created successfully.`,
      timestamp: res.locals.timestamp,
    });
  } catch (error) {
    // handling any errors, formatting the message
    const message =
      error instanceof Error ? error.message : JSON.stringify(error);
    // throwing error with custom message and status code
    throw new AppError(message, 403);
  }
};

// Exporting these controllers for use in routes
export { signinController, signupController };
