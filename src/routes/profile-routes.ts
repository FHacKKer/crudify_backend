import {Router} from "express"
import {getProfile, updateProfile} from "../controllers/profile-controller";
import verifyAccessToken from "../middleware/token-verification";
import authorizeRole from "../middleware/authorize-role";
import ROLES from "../config/roles";
import getProfileMiddleware from "../middleware/profile-middleware/getProfile";
import updateProfileMiddleware from "../middleware/profile-middleware/updateProfile";




const router = Router();

// controller for profile fetching
router.get('/',verifyAccessToken, authorizeRole([ROLES.ADMIN,ROLES.USER,ROLES.MODERATOR]), getProfileMiddleware,getProfile)

router.patch("/", verifyAccessToken, authorizeRole([ROLES.ADMIN,ROLES.USER,ROLES.MODERATOR]), updateProfileMiddleware, updateProfile)


export default router;