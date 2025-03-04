import dotenv from "dotenv";
import axios from "axios";

dotenv.config(); // ✅ Load environment variables first

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const ALCHEMY_URL = `https://polygon-amoy.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

export const fetchNFT = async (req, res) => {
    try {
        const response = await axios.get(`${ALCHEMY_URL}/getNFTsForCollection`, {
            params: {
                contractAddress: CONTRACT_ADDRESS,
                withMetadata: true
            }
        });

        return res.json({ success: true, nfts: response.data.nfts });

    } catch (error) {
        console.error("Error fetching NFTs:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch NFTs" });
    }
};
