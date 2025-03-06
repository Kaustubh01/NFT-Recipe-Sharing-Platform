import express from "express";
import {getUser} from "../controllers/userController.js";

const router = express.Router();

router.post("/", getUser);  // ✅ Use GET request

export default router;
