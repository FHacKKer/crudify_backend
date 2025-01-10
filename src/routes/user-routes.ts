import { Router } from "express";
import ROLES from "../config/roles";
import {createUserController, getUsersController, updateUserController} from "../controllers/user-controller";
import AuthorizeRole from "../middleware/authorize-role";
import VerifyAccessTokenMiddleware from "../middleware/token-verification";
import {updateUserMiddleware} from "../middleware/users-middleware/update-user";
import verifyAccessToken from "../middleware/token-verification";
import authorizeRole from "../middleware/authorize-role";
import createUserMiddleware from "../middleware/users-middleware/create-user";

// Create a new router instance for authentication routes
const router = Router();

// Define a route to get all users
// The request first passes through VerifyAccessTokenMiddleware to validate the access token
// Then, AuthorizeRole ensures that only users with USER, MODERATOR, or ADMIN roles can access this route
// Finally, the getUsers controller handles the logic for fetching and returning the users
router.get("/",VerifyAccessTokenMiddleware, AuthorizeRole([ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN]), getUsersController);


// Route for updating specific user
router.patch("/",verifyAccessToken, authorizeRole([ROLES.ADMIN]), updateUserMiddleware, updateUserController)


// Route for creating new user
router.post("/", verifyAccessToken, authorizeRole([ROLES.ADMIN]),createUserMiddleware, createUserController)



export default router;
