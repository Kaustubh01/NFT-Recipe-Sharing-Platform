import dotenv from "dotenv";
import axios from "axios";

dotenv.config(); // ✅ Load environment variables first

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

        // Extract owner address (owners array is usually returned)
        return response.data.owners?.[0] || "Unknown Owner";
    } catch (error) {
        console.error(`Error fetching owner for token ${tokenId}:`, error);
        return "Unknown Owner"; // Fallback in case of error
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
                const owner = await fetchNFTOwner(tokenId); // Fetch owner for each NFT

                return {
                    id: tokenId,
                    metadata: nft.metadata,
                    owner, // ✅ Now correctly fetching the owner
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
                owner: address, // Fetch NFTs owned by this address
                contractAddresses: [CONTRACT_ADDRESS], // Filter by contract
                withMetadata: true,
            },
        });

        const nfts = response.data.ownedNfts.map(nft => ({
            id: nft.id?.tokenId,
            metadata: nft.metadata,
            owner: address, // ✅ Owner is the user querying
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