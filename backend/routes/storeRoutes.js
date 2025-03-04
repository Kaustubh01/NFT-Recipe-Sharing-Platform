import express from "express"
import { fetchNFT } from "../controllers/storeController.js"

const router = express.Router();

router.get("/nfts", fetchNFT);

export default router;