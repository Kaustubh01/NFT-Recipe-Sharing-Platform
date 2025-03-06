import prisma from "../config/db";
import dotenv from "dotenv"



export const getUser = async (req, res) => {
    try {
        const {address} = req.body;
        if (!address) {
            return res.status(400).json({message: "Adress of the user is required"})
        }
    
        const user = await prisma.user.findUnique({
            where: {address},
            select: {
                name: true,
                address: true,
                type: true
            }
        })
    
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
    
        return res.json(user)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
}
