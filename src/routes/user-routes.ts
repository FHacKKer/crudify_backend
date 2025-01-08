import { Router } from "express";
import ROLES from "../config/roles";
import { getUsers } from "../controllers/user-controller";
import AuthorizeRole from "../middleware/authorize-role";
import VerifyAccessTokenMiddleware from "../middleware/verify-access-middleware";

// Create a new router instance for authentication routes
const router = Router();

// Define a route to get all users
// The request first passes through VerifyAccessTokenMiddleware to validate the access token
// Then, AuthorizeRole ensures that only users with USER, MODERATOR, or ADMIN roles can access this route
// Finally, the getUsers controller handles the logic for fetching and returning the users
router.get(
  "/",
  VerifyAccessTokenMiddleware,
  AuthorizeRole([ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN]),
  getUsers
);

export default router;
