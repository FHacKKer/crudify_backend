import { Router } from "express";
import {
  signinController,
  signupController,
} from "../controllers/auth-controller";
const router = Router();

router.get("/signup", signupController);

router.get("/signin", signinController);

export default router;
