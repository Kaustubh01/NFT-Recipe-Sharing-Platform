import prisma from "../config/db";
import generateToken from "../utils/jwtUtils";
import {ethers} from "ethers"
import dotenv from "dotenv"

dotenv.config()

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const ALCHEMY_URL = `https://polygon-amoy.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

const mintNFT = async (req, res) => {
    try {
        const {address, tokenURI}= req.body;
        if (!address || !tokenURI) {
            return res.status(400).json({ message: "Address and URI of token are required." });
        }

        console.log("\n🔹 Received Address:", address);
        console.log("\n🔹 Received token uri:", tokenURI);

        const provider = new ethers.JsonRpcProvider(ALCHEMY_URL)
        const wallet = new ethers.Wallet(PR)




    } catch (error) {
        
    }
}