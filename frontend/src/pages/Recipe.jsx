import { jwtDecode } from "jwt-decode";
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { ethers } from "ethers";
import toast from 'react-hot-toast';
import { ChefHat, Clock, List, ListOrdered, Send, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Recipe = () => {
    const token = localStorage.getItem("user_token");
    let userAddress = "";

    // Decode token safely
    try {
        userAddress = token ? jwtDecode(token)?.address?.toLowerCase() || "" : "";
    } catch (error) {
        console.error("Invalid token:", error);
    }

    const location = useLocation();
    const recipe = location.state;
    
    if (!recipe?.metadata) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">No recipe data found.</p>
            </div>
        );
    }

    const { metadata, owner } = recipe;
    const ownerAddress = owner?.toLowerCase() || "";
    console.log("recipe", recipe);
    console.log("ownerAddress", ownerAddress);

    const ingredients = useMemo(() => {
        const ingredientsAttr = metadata?.attributes?.find(attr => attr.trait_type === "Ingredients");
        return ingredientsAttr?.value
            ? ingredientsAttr.value.split("|").map((item, index) => (
                <li key={index} className="flex items-start gap-2 py-1">
                    <span className="text-orange-500 mt-1">•</span>
                    <span className="text-gray-700">{item.trim()}</span>
                </li>
            ))
            : <li className="text-gray-500">No ingredients listed.</li>;
    }, [metadata]);

    const steps = useMemo(() => {
        const stepsAttr = metadata?.attributes?.find(attr => attr.trait_type === "Steps");
        return stepsAttr?.value
            ? stepsAttr.value
                .split("|")
                .map(item => item.trim())
                .filter(item => item.length > 0 && item !== " ")
                .map((item, index) => (
                    <li key={index} className="flex items-start gap-3 py-2">
                        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
                            {index + 1}
                        </span>
                        <span className="text-gray-700">{item}</span>
                    </li>
                ))
            : <li className="text-gray-500">No steps listed.</li>;
    }, [metadata]);

    const ipfsToHTTPS = (ipfsUrl) => {
        if (!ipfsUrl) return '';
        
        const ipfsHash = ipfsUrl.replace('ipfs://', '');
        
        // If the URL already includes a filename (contains a slash)
        if (ipfsHash.includes('/')) {
            return `https://ipfs.io/ipfs/${ipfsHash}`;
        }

        // Try to get the filename from metadata
        const filename = metadata?.filename;
        console.log("Image filename from metadata:", filename);
        
        if (filename) {
            return `https://ipfs.io/ipfs/${ipfsHash}/${filename}`;
        }

        // If we can't find the filename in metadata, try to fetch the directory listing
        return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    };

    const imageUrl = useMemo(() => {
        console.log("metadata.image", metadata.image);
        return metadata?.image ? ipfsToHTTPS(metadata.image) : '';
    }, [metadata]);

    const tipChef = async () => {
        if (!window.ethereum) {
            toast.error("Please install MetaMask to send tips.");
            return;
        }

        if (!ethers.isAddress(ownerAddress)) {
            toast.error("Invalid recipient address.");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const network = await provider.getNetwork();

            if (network.chainId !== 80002) {
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0x13882" }], 
                });
            }

            const tx = await signer.sendTransaction({
                to: ownerAddress,
                value: ethers.parseEther("0.01"), // Sends 0.01 MATIC as a tip
                gasLimit: 21000 
            });
            
            await tx.wait();
            toast.success("Tip sent successfully!");
        } catch (error) {
            console.error("Transaction failed:", error);
            toast.error("Failed to send tip: " + (error.message || error));
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Link 
                to="/store" 
                className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Recipes
            </Link>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="relative h-[400px] overflow-hidden">
                    <img 
                        src={imageUrl} 
                        alt={metadata.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Fallback to Pinata gateway if IPFS.io fails
                            const pinataUrl = `https://gateway.pinata.cloud/ipfs/${metadata.image.replace('ipfs://', '')}`;
                            e.target.src = pinataUrl;
                            
                            // If Pinata gateway also fails, try to get the first image from directory
                            e.onerror = () => {
                                fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`)
                                    .then(response => response.text())
                                    .then(html => {
                                        const match = html.match(/href="([^"]+\.(jpg|jpeg|png|gif))"/i);
                                        if (match) {
                                            e.target.src = `https://gateway.pinata.cloud/ipfs/${ipfsHash}/${match[1]}`;
                                        }
                                    })
                                    .catch(console.error);
                            };
                        }}
                    />
                </div>

                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-gray-900 first-letter:uppercase">
                            {metadata.name}
                        </h1>
                        <div className="flex items-center gap-2 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">
                                {new Date(recipe.dateMinted).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <p className="text-gray-600 mb-8">{metadata.description}</p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <List className="w-5 h-5 text-orange-500" />
                                <h2 className="text-xl font-semibold text-gray-900">Ingredients</h2>
                            </div>
                            <ul className="space-y-1">{ingredients}</ul>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <ListOrdered className="w-5 h-5 text-orange-500" />
                                <h2 className="text-xl font-semibold text-gray-900">Steps</h2>
                            </div>
                            <ol className="space-y-2">{steps}</ol>
                        </div>
                    </div>

                    {/* Show "Tip Chef" button only if the user is NOT the owner */}
                    {(!token || userAddress !== ownerAddress) && (
                        <div className="mt-8 pt-6 border-t border-orange-100">
                            <button 
                                onClick={tipChef}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors w-full sm:w-auto"
                            >
                                <Send className="w-4 h-4" />
                                Tip Chef
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Recipe;
