import { NextFunction, Request, Response } from "express";

type credentials = {
  login: string;
  password: string;
};

const signInMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const credentials: credentials = req.body; // Extract login and password from the request body

  if (!credentials || !credentials.login || !credentials.password) {
    // Return error response if login or password is missing
    res.status(401).json({
      success: false, // Error case, hence success is false
      message: "Please provide both username and password.",
      timestamp: res.locals.timestamp,
    });
    return;
  }

  // Trim the login and retain the password in the request body for further processing
  req.body = {
    login: credentials.login.trim(),
    password: credentials.password,
  };

  next(); // Proceed to the next middleware or route handler
};

export { signInMiddleware };
