import { createContext, useContext, useEffect, useState } from "react";
import { fetchNFTS } from "../services/nftServices";

const NFTContext = createContext();

export const NFTProvider = ({children})=>{
    const [nfts, setNfts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getNfts = async () => {
            try {
                const data = await fetchNFTS();
                console.log("Fetched NFTs:", data); 
                
                if (Array.isArray(data)) {
                    setNfts(data);
                } else if (data && Array.isArray(data.nfts)) {
                    setNfts(data.nfts); 
                } else {
                    console.error("Unexpected API response:", data);
                    setNfts([]); 
                }
            } catch (error) {
                setError(error.message);
                setNfts([]); 
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