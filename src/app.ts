import cors, { CorsOptions } from "cors";
import express from "express";
import ErrorHandlerMiddleware from "./middleware/error-handler";
import logger from "./middleware/logger";
import timeStampMiddleware from "./middleware/timestamp";
import authRouter from "./routes/auth-routes";
import greetRouter from "./routes/greet-routes";
import profileRouter from "./routes/profile-routes";
import userRouter from "./routes/user-routes";
import { AppError } from "./util/AppError";

// Initialize the Express application
const app = express();

// Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://crudify-ten.vercel.app",
];
// Options for CORS middleware
const options: CorsOptions = {
  origin: (requestOrigin, callback) => {
    if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
      callback(null, true);
    } else {
      callback(new AppError("Not allowed by CORS", 401));
    }
  },
  credentials: true,
};

// Apply middlewares
app.use(cors(options));
app.options("*", cors(options)); // Handle Preflight Requests
app.use(express.json());
app.use(logger);
app.use(timeStampMiddleware);

// Define routes for specific endpoints
app.use("/", greetRouter); // Routes for greeting-related operations
app.use("/api/v1/auth", authRouter); // Routes for authentication operations
app.use("/api/v1/users", userRouter); // Routes for user-related operations
app.use(`/api/v1/profile`, profileRouter); // Routes for user profile related operations

// Apply the error handler middleware
app.use(ErrorHandlerMiddleware);

// Export the Express application for use in other modules
export default app;
