import React from "react";
import { useOwnerNFTs } from "../contexts/OwnerNFTContext";

const OwnerNFTList = () => {
    const { nfts, loading, error } = useOwnerNFTs();

    if (loading) return <p>Loading NFTs...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>NFTs</h2>
            {nfts.length === 0 ? (
                <p>No NFTs found</p>
            ) : (
                <ul>
                    {nfts.map((nft) => (
                        <li key={nft.id}>
                            <h3>{nft.metadata?.name || "Unnamed NFT"}</h3>
                            <p>{nft.metadata?.description || "No description available"}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OwnerNFTList;