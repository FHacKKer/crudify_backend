import { Router } from "express";
import { greet, greetName } from "../controllers/greet-controller"; // Importing the controller functions
const router = Router();

// Route to greet the user with a general message
router.get("/", greet);

// Route to greet the user by their name
router.get("/:name", greetName);

export default router;
