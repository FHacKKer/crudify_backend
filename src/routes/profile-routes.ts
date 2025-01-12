import {Router} from "express"
import {getProfileController, updateProfileController,deleteProfileController} from "../controllers/profile-controller";
import verifyAccessToken from "../middleware/token-verification";
import authorizeRole from "../middleware/authorize-role";
import ROLES from "../config/roles";
import getProfileMiddleware from "../middleware/profile-middleware/getProfile";
import updateProfileMiddleware from "../middleware/profile-middleware/updateProfile";
import deleteProfileMiddleware from "../middleware/profile-middleware/deleteProfile";




const router = Router();

// Controller for profile fetching
router.get('/', verifyAccessToken, authorizeRole([ROLES.ADMIN, ROLES.USER, ROLES.MODERATOR]), getProfileMiddleware, getProfileController);

// Controller for updating profile
router.patch("/", verifyAccessToken, authorizeRole([ROLES.ADMIN, ROLES.USER, ROLES.MODERATOR]), updateProfileMiddleware, updateProfileController);

// Controller for deleting profile
router.delete("/", verifyAccessToken, authorizeRole([ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER]), deleteProfileMiddleware, deleteProfileController);

export default router;