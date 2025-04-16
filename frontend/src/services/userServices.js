import axios from "axios";
import {jwtDecode} from "jwt-decode";  // Ensure you install with `npm install jwt-decode`

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

const fetchUser = async () => {
    try {
        const token = localStorage.getItem("user_token");

        if (!token) throw new Error("No token found, please log in.");
        
        const decoded = jwtDecode(token);
        console.log("token", decoded)
        const address = decoded?.address;
        console.log("address", address)

        if (!address) throw new Error("Invalid token, address missing.");

        const response = await axios.post(`${API_BASE_URL}/user`, { address });

        console.log("✅ Fetched user data:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching user:", error.response?.data || error.message);
        throw error;
    }
};


export{fetchUser}