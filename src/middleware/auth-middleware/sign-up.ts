import { NextFunction, Request, Response } from "express";
import { IUser } from "../../types";
import { isUserExist } from "../../util/isUserExist";
import { validateUser } from "../../util/validate-user";

/**
 * Middleware to handle user signup validation, ensuring user input is valid
 * and no duplicates (username/email) exist.
 */
const signUpMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user: IUser = req.body;

  if (!user || !user.email || !user.name || !user.username || !user.password) {
    // Respond with an error if required fields are missing
    res.status(401).json({
      success: false,
      message: "All fields are required: name, username, email, and password.",
      timestamp: res.locals.timestamp,
    });
    return;
  }

  if (user.role || user.role === undefined) {
    user.role = "user";
  }

  const validationResult = validateUser(user);

  if (!validationResult.success) {
    // Respond with error message if validation fails
    res.status(401).json({
      success: false,
      message: validationResult.message,
      timestamp: res.locals.timestamp,
    });
    return;
  }

  const { user: newUser } = validationResult;

  isUserExist(newUser.email, newUser.username).then((result) => {
    if (result.exists) {
      // Respond if username/email already exists
      res.status(200).json({
        success: false,
        message: result.message,
        timestamp: res.locals.timestamp,
      });
      return;
    }

    // Pass validated user to the next middleware
    req.body = newUser;
    next();
  });
};

export default signUpMiddleware;
