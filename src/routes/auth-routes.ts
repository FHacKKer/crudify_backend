import { Router } from "express";
import {
  signinController,
  signupController,
} from "../controllers/auth-controller";
import { signInMiddleware } from "../middleware/auth-middleware/sign-in";
import signUpMiddleware from "../middleware/auth-middleware/sign-up";

// Create a new router instance for authentication routes
const router = Router();

// Route for user sign-in
// Applies signInMiddleware to validate the request before calling signinController
router.post("/signin", signInMiddleware, signinController);

// Route for user sign-up
// Applies signUpMiddleware to validate the request before calling signupController
router.post("/signup", signUpMiddleware, signupController);

// Export the router to be used in the main application
export default router;
