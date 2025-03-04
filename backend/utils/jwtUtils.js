import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing! Set it in your .env file.");
    throw new Error("JWT_SECRET is required but not defined.");
}

// Generate JWT Token
const generateToken = (address) => {
    return jwt.sign({ address }, JWT_SECRET, { expiresIn: "7d" });
};

// Verify JWT Token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        console.error("❌ Error verifying JWT token:", error.message);
        return null;
    }
};

// Decode JWT Token (Without Verification)
const decodeToken = (token) => {
    return jwt.decode(token);
};

// Export all functions properly
export { generateToken, verifyToken, decodeToken };
