import cors, { CorsOptions } from "cors";
import express from "express";
import ErrorHandlerMiddleware from "./middleware/error-handler";
import logger from "./middleware/logger";
import timeStampMiddleware from "./middleware/timestamp";
import authRouter from "./routes/auth-routes";
import greetRouter from "./routes/greet-routes";
import profileRouter from "./routes/profile-routes";
import userRouter from "./routes/user-routes";

// Initialize the Express application
const app = express();

// Options for CORS middleware
const options: CorsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
};

// Apply middlewares
app.use(cors(options));
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
