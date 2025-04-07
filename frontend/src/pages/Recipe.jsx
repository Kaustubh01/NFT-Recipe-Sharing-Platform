import { jwtDecode } from "jwt-decode";
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { ethers } from "ethers";
import toast from 'react-hot-toast';

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
        return <p>No recipe data found.</p>;
    }

    const { metadata, owner } = recipe;
    const ownerAddress = owner?.toLowerCase() || "";
    console.log("recipe", recipe);
    console.log("ownerAddress", ownerAddress);

    const ingredients = useMemo(() => {
        const ingredientsAttr = metadata?.attributes?.find(attr => attr.trait_type === "Ingredients");
        return ingredientsAttr?.value
            ? ingredientsAttr.value.split("|").map((item, index) => <li key={index}>{item.trim()}</li>)
            : <li>No ingredients listed.</li>;
    }, [metadata]);

    const steps = useMemo(() => {
        const stepsAttr = metadata?.attributes?.find(attr => attr.trait_type === "Steps");
        return stepsAttr?.value
            ? stepsAttr.value.split("|").map((item, index) => <li key={index}>{item.trim()}</li>)
            : <li>No steps listed.</li>;
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
        <div>
            <h2>{metadata.name}</h2>
            {imageUrl && (
                <div className="recipe-image-container">
                    <img 
                        src={imageUrl} 
                        alt={metadata.name}
                        className="recipe-image"
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
            )}
            <p>{metadata.description}</p>
            
            <h3>Ingredients</h3>
            <ul>{ingredients}</ul>
            
            <h3>Steps</h3>
            <ol>{steps}</ol>

            {/* Show "Tip Chef" button only if the user is NOT the owner */}
            {(!token || userAddress !== ownerAddress) && (
                <button 
                    onClick={tipChef}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                    Tip Chef
                </button>
            )}
        </div>
    );
};

export default Recipe;
