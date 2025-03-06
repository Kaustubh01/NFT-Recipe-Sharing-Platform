import axios from "axios"
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = 'http://localhost:5000/api';

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
        const token = localStorage.getItem("token")
        if (!token) throw new Error("No token found, please log in.");

        const decoded = jwtDecode(token)
        const address = decoded?.address;
        console.log("address", address)

        if (!address) throw new Error("Invalid token, address missing.");

        // Send a POST request without Authorization header
        const response = await axios.post(`${API_BASE_URL}/store/nfts-of-owner`, { address });


        console.log("✅ Fetched user nfts data:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching user nfts:", error.response?.data || error.message);
        throw error;
        
    }
}

export {fetchNFTS, fetchNFTSofOwner}