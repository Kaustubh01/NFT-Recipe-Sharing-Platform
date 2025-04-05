import React from "react";
import { useNFTs } from "../contexts/NFTContext";
import { Link } from "react-router-dom";
import "../styles/components/nftList.css"

const NFTList = () => {
    const { nfts, loading, error } = useNFTs();

    const ipfsToHTTPS = (ipfsUrl, metadata) => {
        if (!ipfsUrl) return '';
        
        const ipfsHash = ipfsUrl.replace('ipfs://', '');
        
        // If the URL already includes a filename (contains a slash)
        if (ipfsHash.includes('/')) {
            return `https://ipfs.io/ipfs/${ipfsHash}`;
        }

        // Try to get the filename from metadata
        const filename = metadata?.filename;
        
        if (filename) {
            return `https://ipfs.io/ipfs/${ipfsHash}/${filename}`;
        }

        // If we can't find the filename in metadata, try to fetch the directory listing
        return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    };

    if (loading) return <p>Loading NFTs...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="list">
            {nfts.length === 0 ? (
                <p>No NFTs found</p>
            ) : (
                <ul>
                    {nfts.map((nft) => (
                        <li key={nft.id}>
                            <div className="card">
                                <Link to="/recipe" state={nft}>
                                    <img 
                                        src={ipfsToHTTPS(nft.metadata?.image, nft.metadata)} 
                                        alt={nft.metadata?.name || "Recipe Image"}
                                        onError={(e) => {
                                            // Fallback to Pinata gateway if IPFS.io fails
                                            const ipfsHash = nft.metadata?.image?.replace('ipfs://', '');
                                            if (ipfsHash) {
                                                const pinataUrl = nft.metadata?.filename
                                                    ? `https://gateway.pinata.cloud/ipfs/${ipfsHash}/${nft.metadata.filename}`
                                                    : `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
                                                e.target.src = pinataUrl;
                                            }
                                        }}
                                    />
                                    <h3>{nft.metadata?.name || "Unnamed NFT"}</h3>
                                    <p>{nft.metadata?.description || "No description available"}</p>
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NFTList;