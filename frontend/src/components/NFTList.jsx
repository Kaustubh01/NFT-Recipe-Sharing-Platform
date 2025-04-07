import React, { useState } from "react";
import { useNFTs } from "../contexts/NFTContext";
import { Link } from "react-router-dom";

const NFTList = () => {
    const { nfts, loading, error } = useNFTs();
    const [imageErrors, setImageErrors] = useState({});

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

        // If we can't find the filename in metadata, try the direct hash
        return `https://ipfs.io/ipfs/${ipfsHash}`;
    };

    const handleImageError = (nftId, e) => {
        // Prevent infinite error loop
        if (imageErrors[nftId]) return;

        const metadata = nfts.find(nft => nft.id === nftId)?.metadata;
        if (!metadata?.image) return;

        // Mark this image as having an error
        setImageErrors(prev => ({ ...prev, [nftId]: true }));

        // Try Pinata gateway
        const ipfsHash = metadata.image.replace('ipfs://', '');
        if (!ipfsHash) return;

        // Try with filename if available
        if (metadata.filename) {
            e.target.src = `https://gateway.pinata.cloud/ipfs/${ipfsHash}/${metadata.filename}`;
        } else {
            // Try direct hash
            e.target.src = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        }
    };

    if (loading) return <div className="loading">Loading NFTs...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="list">
            {nfts.length === 0 ? (
                <p className="no-nfts">No NFTs found</p>
            ) : (
                <ul className="nft-grid">
                    {nfts.map((nft) => (
                        <li key={nft.id} className="nft-item">
                            <div className="card">
                                <Link to="/recipe" state={nft}>
                                    <div className="image-container">
                                        <img 
                                            src={ipfsToHTTPS(nft.metadata?.image, nft.metadata)} 
                                            alt={nft.metadata?.name || "Recipe Image"}
                                            onError={(e) => handleImageError(nft.id, e)}
                                            className="recipe-image"
                                        />
                                    </div>
                                    <div className="card-content">
                                        <h3 className="recipe-title">{nft.metadata?.name || "Unnamed Recipe"}</h3>
                                        <p className="recipe-description">{nft.metadata?.description || "No description available"}</p>
                                    </div>
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