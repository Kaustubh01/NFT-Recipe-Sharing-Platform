import React from "react";
import { useNFTs } from "../contexts/NFTContext";
import { Link } from "react-router-dom";
import "../styles/components/nftList.css"
const NFTList = () => {
    const { nfts, loading, error } = useNFTs();

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
                                    <img src="" alt="" />
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