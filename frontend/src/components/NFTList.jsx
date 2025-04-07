import React, { useState } from "react";
import { useNFTs } from "../contexts/NFTContext";
import { Link } from "react-router-dom";
import { Loader2, ArrowRight } from "lucide-react";

const NFTList = () => {
    const { nfts, loading, error } = useNFTs();
    const [imageErrors, setImageErrors] = useState({});

    const ipfsToHTTPS = (ipfsUrl, metadata) => {
        if (!ipfsUrl) return '';
        
        const ipfsHash = ipfsUrl.replace('ipfs://', '');
        
        if (ipfsHash.includes('/')) {
            return `https://ipfs.io/ipfs/${ipfsHash}`;
        }

        const filename = metadata?.filename;
        
        if (filename) {
            return `https://ipfs.io/ipfs/${ipfsHash}/${filename}`;
        }

        return `https://ipfs.io/ipfs/${ipfsHash}`;
    };

    const handleImageError = (nftId, e) => {
        if (imageErrors[nftId]) return;

        const metadata = nfts.find(nft => nft.id === nftId)?.metadata;
        if (!metadata?.image) return;

        setImageErrors(prev => ({ ...prev, [nftId]: true }));

        const ipfsHash = metadata.image.replace('ipfs://', '');
        if (!ipfsHash) return;

        if (metadata.filename) {
            e.target.src = `https://gateway.pinata.cloud/ipfs/${ipfsHash}/${metadata.filename}`;
        } else {
            e.target.src = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                <p className="text-gray-600">Loading delicious recipes...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">Error: {error}</p>
            </div>
        </div>
    );

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            {nfts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No recipes found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {nfts
                        .sort((a, b) => new Date(b.dateMinted) - new Date(a.dateMinted))
                        .filter(nft => {
                            const recipeName = nft.metadata?.name?.toLowerCase() || "";
                            return ![
                                "garlic butter pasta",
                                "colorful vegetable stir-fry",
                                "veggie stir-fry",
                                "palak paneer",
                                "garden salad",
                                "bread butter",
                                "Garden Salad"
                            ].includes(recipeName) && 
                            nft.id !== "0x0000000000000000000000000000000000000000000000000000000000000005";
                        })
                        .map((nft) => (
                            <Link 
                                key={nft.id} 
                                to="/recipe" 
                                state={nft}
                                className="group"
                            >
                                <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.02] h-[420px] flex flex-col group-hover:bg-orange-50">
                                    <div className="relative h-[240px] overflow-hidden">
                                        <img 
                                            src={ipfsToHTTPS(nft.metadata?.image, nft.metadata)} 
                                            alt={nft.metadata?.name || "Recipe Image"}
                                            onError={(e) => handleImageError(nft.id, e)}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors duration-300 first-letter:uppercase">
                                                {nft.metadata?.name || "Unnamed Recipe"}
                                            </h3>
                                            <p className="text-gray-600 text-sm line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
                                                {nft.metadata?.description || "No description available"}
                                            </p>
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-orange-100 group-hover:border-orange-200 transition-colors duration-300">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                                                    {new Date(nft.dateMinted).toLocaleDateString()}
                                                </span>
                                                <div className="flex items-center gap-1 text-orange-500 font-medium text-sm group-hover:text-orange-600 transition-colors duration-300">
                                                    View Recipe
                                                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                </div>
            )}
        </div>
    );
};

export default NFTList;