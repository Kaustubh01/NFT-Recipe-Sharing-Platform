import axios from "axios"
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

const fetchNFTS = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/store/nfts`)
        console.log("fetched nfts", response.data);
        return response.data;
    } catch (error) {
        console.error('Error Fetching nfts', error)
        throw error
    }
}

const fetchNFTSofOwner = async ()=>{
    try {
        const token = localStorage.getItem("user_token")
        if (!token) throw new Error("No token found, please log in.");

        const decoded = jwtDecode(token)
        const address = decoded?.address;
        console.log("address", address)

        if (!address) throw new Error("Invalid token, address missing.");

        const response = await axios.post(`${API_BASE_URL}/store/nfts-of-owner`, { address });


        console.log("✅ Fetched user nfts data:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching user nfts:", error.response?.data || error.message);
        throw error;
        
    }
}

export {fetchNFTS, fetchNFTSofOwner}