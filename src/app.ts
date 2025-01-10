import cors, { CorsOptions } from "cors";
import express from "express";
import ErrorHandlerMiddleware from "./middleware/error-handler";
import logger from "./middleware/logger";
import timeStampMiddleware from "./middleware/timestamp";
import authRouter from "./routes/auth-routes";
import greetRouter from "./routes/greet-routes";
import userRouter from "./routes/user-routes";

// Initialize the Express application
const app = express();

// Allowed Origins
const allowedOrigins = ["*"];
// Options for CORS middleware
const options: CorsOptions = {
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
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

// Apply the error handler middleware (MUST BE LAST)
app.use(ErrorHandlerMiddleware);

// Export the Express application for use in other modules
export default app;
