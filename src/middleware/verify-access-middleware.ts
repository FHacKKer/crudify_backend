import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { IAccessToken } from "../types";

const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header
  const { JWT_SECRET } = env(); // Retrieve the JWT secret from environment variables

  if (!token) {
    // Respond with 401 if no token is provided
    res.status(401).json({
      success: false,
      message: `Access Denied! Please Login First!`,
      timestamp: res.locals.timestamp,
    });
    return;
  }

  try {
    // Verify the token and attach the payload to the request body
    const payload: IAccessToken = jwt.verify(token, JWT_SECRET) as IAccessToken;
    req.body = payload;
    next(); // Proceed to the next middleware if verification succeeds
  } catch (error) {
    // Respond with 401 if the token is invalid or tampered
    res.status(401).json({
      success: false,
      timestamp: res.locals.timestamp,
      message: "Access Denied! Invalid or tampered token",
    });
    return;
  }
};

export default verifyAccessToken;
