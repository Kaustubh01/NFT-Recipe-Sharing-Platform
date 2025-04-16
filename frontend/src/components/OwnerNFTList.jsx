import React, { useState } from "react";
import { useOwnerNFTs } from "../contexts/OwnerNFTContext";
import { Link } from "react-router-dom";
import { ChefHat, Clock, ArrowRight } from "lucide-react";

const OwnerNFTList = () => {
    const { nfts, loading, error } = useOwnerNFTs();
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
        <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                <p className="text-gray-600">Loading your recipes...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
            <p className="text-red-600">Error: {error}</p>
        </div>
    );

    if (nfts.length === 0) return (
        <div className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-orange-50 rounded-full">
                    <ChefHat className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">No Recipes Yet</h3>
                <p className="text-gray-600 max-w-md">
                    You haven't minted any recipes yet. Start sharing your culinary creations with the world!
                </p>
                <Link 
                    to="/recipe" 
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                    Create Your First Recipe
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    to={`/recipe/${nft.id}`} 
                    key={nft.id}
                    className="group"
                >
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col">
                        <div className="relative aspect-video overflow-hidden">
                            <img 
                                src={ipfsToHTTPS(nft.metadata?.image, nft.metadata)} 
                                alt={nft.metadata?.name || "Recipe"}
                                onError={(e) => handleImageError(nft.id, e)}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                                {nft.metadata?.name || "Unnamed Recipe"}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                                {nft.metadata?.description || "No description available"}
                            </p>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Clock className="h-4 w-4" />
                                    <span className="text-xs">
                                        {new Date(nft.metadata?.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-orange-500 text-sm font-medium">
                                    View Recipe
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default OwnerNFTList;