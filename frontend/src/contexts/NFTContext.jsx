import { createContext, useContext, useEffect, useState } from "react";
import { fetchNFTS } from "../services/dashboardServices";

const NFTContext = createContext();

export const NFTProvider = ({children})=>{
    const [nfts, setNfts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getNfts = async () => {
            try {
                const data = await fetchNFTS();
                console.log("Fetched NFTs:", data); // 🔍 Log API response
                
                if (Array.isArray(data)) {
                    setNfts(data);
                } else if (data && Array.isArray(data.nfts)) {
                    setNfts(data.nfts); // ✅ Fix: Extract the correct array
                } else {
                    console.error("Unexpected API response:", data);
                    setNfts([]); // Set empty array to avoid errors
                }
            } catch (error) {
                setError(error.message);
                setNfts([]); // Set empty array to prevent crashes
            } finally {
                setLoading(false);
            }
        };
        getNfts();
    }, []);
    

    return (
        <NFTContext.Provider value={{nfts, loading, error}}>
            {children}
        </NFTContext.Provider>
    )
    
}

export const useNFTs = () =>{
    return useContext(NFTContext);
}