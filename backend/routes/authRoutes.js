import express from "express"
import { authenticateUser } from "../controllers/authController.js"

const router = express.Router();

router.post("/auth", authenticateUser);

export default router;