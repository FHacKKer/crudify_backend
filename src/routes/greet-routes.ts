import { Router } from "express";
import { greet, greetName } from "../controllers/greet-controller";
const router = Router();


router.get("/", greet);

router.get("/:name", greetName);

export default router;
