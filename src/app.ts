import express from "express";
import ErrorHandlerMiddleware from "./middleware/error-handler";
import logger from "./middleware/logger";
import timeStampMiddleware from "./middleware/timestamp";
import authRouter from "./routes/auth-routes";
import greetRouter from "./routes/greet-routes";
import userRouter from "./routes/user-routes";

// Initialize the Express application
const app = express();

// Use JSON middleware to parse incoming JSON requests
app.use(express.json());

// Apply middlewares for logging, timestamping, and error handling
app.use(logger);
app.use(timeStampMiddleware);
app.use(ErrorHandlerMiddleware);

// Define routes for specific endpoints
app.use("/api/v1/greet", greetRouter); // Routes for greeting-related operations
app.use("/api/v1/auth", authRouter); // Routes for authentication operations
app.use("/api/v1/users", userRouter); // Routes for user-related operations

// Export the Express application for use in other modules
export default app;
