import { NextFunction, Request, Response } from "express";
import { UserModel } from "../../models/User-Model";
import { AppError } from "../../util/AppError";

interface IUser {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface ValidateUserReturn {
  success: boolean;
  message: string;
  user: IUser;
}

/**
 * Validates the user input, ensuring required fields are filled and data is formatted correctly.
 * @param user - The user object to be validated.
 * @returns Validation result with success status and message.
 */
function validateUser(user: IUser): ValidateUserReturn {
  const { name, username, email, password } = user;
  // Trim values (except password)
  const trimmedName = name.trim();
  const trimmedUsername = username.trim();
  const trimmedEmail = email.trim().toLowerCase();

  // Normalize email by removing 'plus' aliasing (e.g., abc+123@mail.com -> abc@mail.com)

  // Check if there is a '+' in the email to handle aliasing
  let validTrimmedEmail = trimmedEmail;

  if (trimmedEmail.includes("+")) {
    const [first, last] = trimmedEmail.split("+");
    const validLast = last.split("@")[1];
    validTrimmedEmail = `${first}@${validLast}`;
  }

  // Validate fields
  if (!trimmedName || !trimmedUsername || !validTrimmedEmail || !password) {
    return {
      success: false,
      message: "All fields are required: name, username, email, and password.",
      user: user,
    };
  }

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(validTrimmedEmail)) {
    return {
      success: false,
      message: "Invalid email format. Please provide a valid email address.",
      user,
    };
  }

  // Username validation to ensure no spaces
  const usernameRegex = /^\S+$/;
  if (!usernameRegex.test(trimmedUsername)) {
    return {
      success: false,
      message: "Username must not contain spaces.",
      user,
    };
  }

  // Return the processed user object with validated fields
  const processedUser: IUser = {
    name: trimmedName,
    username: trimmedUsername,
    email: validTrimmedEmail,
    password, // Password should not be trimmed for security purposes
  };

  return {
    success: true,
    message: `User Validated Successfully!`,
    user: processedUser,
  };
}

/**
 * Checks if the username or email already exists in the database.
 * @param email - The email to check.
 * @param username - The username to check.
 * @returns Object indicating if the user exists and a corresponding message.
 */
async function isUserExist(
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
