import axios from "axios"

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchNFTS = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/store/nfts`)
        console.log("fetched nfts", response.data);
        return response.data;
    } catch (error) {
        console.error('Error Fetching nfts', error)
        throw error
    }
}