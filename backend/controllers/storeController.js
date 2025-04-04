import dotenv from "dotenv";
import axios from "axios";

dotenv.config(); 

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const ALCHEMY_URL = `https://polygon-amoy.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;


const fetchNFTOwner = async (tokenId) => {
    try {
        const response = await axios.get(`${ALCHEMY_URL}/getOwnersForNFT`, {
            params: {
                contractAddress: CONTRACT_ADDRESS,
                tokenId,
            },
        });

        return response.data.owners?.[0] || "Unknown Owner";
    } catch (error) {
        console.error(`Error fetching owner for token ${tokenId}:`, error);
        return "Unknown Owner"; 
    }
};

/**
 * Fetches NFTs from a collection along with their owner addresses.
 */
const fetchNFT = async (req, res) => {
    try {
        const response = await axios.get(`${ALCHEMY_URL}/getNFTsForCollection`, {
            params: {
                contractAddress: CONTRACT_ADDRESS,
                withMetadata: true,
            },
        });

        const nfts = await Promise.all(
            response.data.nfts.map(async (nft) => {
                const tokenId = nft.id?.tokenId;
                const owner = await fetchNFTOwner(tokenId); 

                return {
                    id: tokenId,
                    metadata: nft.metadata,
                    owner, 
                    dateMinted: new Date(nft.timeLastUpdated).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }),
                };
            })
        );

        return res.json({ success: true, nfts });
    } catch (error) {
        console.error("Error fetching NFTs:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch NFTs" });
    }
};


const fetchNFTsOfAUser = async (req, res) => {
    const { address } = req.body;

    if (!address) {
        return res.status(400).json({ success: false, message: "User address is required" });
    }

    try {
        const response = await axios.get(`${ALCHEMY_URL}/getNFTs`, {
            params: {
                owner: address, 
                contractAddresses: [CONTRACT_ADDRESS],
                withMetadata: true,
            },
        });

        const nfts = response.data.ownedNfts.map(nft => ({
            id: nft.id?.tokenId,
            metadata: nft.metadata,
            owner: address, 
            dateMinted: nft.timeLastUpdated
                ? new Date(nft.timeLastUpdated).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                  })
                : "Unknown",
        }));

        return res.json({ success: true, nfts });
    } catch (error) {
        console.error("Error fetching user NFTs:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch user NFTs" });
    }
};

  

export { fetchNFT, fetchNFTsOfAUser };