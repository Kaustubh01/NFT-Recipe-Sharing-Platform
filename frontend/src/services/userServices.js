import axios from "axios";
import {jwtDecode} from "jwt-decode";  // Ensure you install with `npm install jwt-decode`

const API_BASE_URL = "http://localhost:5000/api";

export const fetchUser = async () => {
    try {
        const token = localStorage.getItem("token");

        if (!token) throw new Error("No token found, please log in.");
        
        // Decode token to extract the address
        const decoded = jwtDecode(token);
        console.log("token", decoded)
        const address = decoded?.address;
        console.log("address", address)

        if (!address) throw new Error("Invalid token, address missing.");

        // Send a POST request without Authorization header
        const response = await axios.post(`${API_BASE_URL}/user`, { address });

        console.log("✅ Fetched user data:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching user:", error.response?.data || error.message);
        throw error;
    }
};
