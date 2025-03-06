import express from "express"
import { fetchNFT, fetchNFTsOfAUser } from "../controllers/storeController.js"

const router = express.Router();

router.get("/nfts", fetchNFT);
router.post("/nfts-of-owner", fetchNFTsOfAUser);

export default router;