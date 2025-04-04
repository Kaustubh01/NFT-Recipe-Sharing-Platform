import prisma from "../config/db.js";
import {generateToken} from "../utils/jwtUtils.js";

export const authenticateUser = async (req, res) => {
    try {
        const { address, name } = req.body;

        if (!address) {
            return res.status(400).json({ message: "Address is required." });
        }

        console.log("\n🔹 Received Address:", address);

        let user = await prisma.user.findUnique({ where: { address } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    address,
                    name: name,  
                    type: "CHEF",
                }
            });
            console.log("✅ New user created:", user);
        } else {
            console.log("✅ User already exists:", user);
        }

        const token = generateToken(user.address);

        return res.json({
            message: "Authentication successful",
            token,
            user: {
                name: user.name,
                address: user.address,
                type: user.type,
            }
        });

    } catch (error) {
        console.error("❌ Authentication error:", error);

        return res.status(500).json({ message: "Internal server error" });
    }
};
