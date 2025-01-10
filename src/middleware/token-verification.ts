import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {env} from "../config/env";
import {IAccessToken} from "../types";

const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const { JWT_SECRET } = env(); // Retrieve the JWT secret from environment variables

  let authHeader = req.headers.authorization; // Extract the token from the Authorization header

  if (!authHeader || !authHeader.startsWith("Bearer ") || !authHeader.split(" ")[1]) {
    // Respond with 401 if no token is provided
    res.status(401).json({
      success: false,
      message: `Access Denied: Missing or invalid authentication token. Please log in to continue.`,
      timestamp: res.locals.timestamp,
    });
    return;
  }

  let token = authHeader.split(" ")[1]


  try {
    // Verify the token and attach the payload to the request body
    req.user = jwt.verify(token, JWT_SECRET) as IAccessToken;
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
