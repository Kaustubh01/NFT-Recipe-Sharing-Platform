import { jwtDecode } from "jwt-decode";
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { ethers } from "ethers";

const Recipe = () => {
    const token = localStorage.getItem("token");
    let userAddress = "";

    // Decode token safely
    try {
        userAddress = token ? jwtDecode(token)?.address?.toLowerCase() || "" : "";
    } catch (error) {
        console.error("Invalid token:", error);
    }

    const location = useLocation();
    const recipe = location.state;
    
    // Handle missing recipe data
    if (!recipe?.metadata) {
        return <p>No recipe data found.</p>;
    }

    const { metadata, owner } = recipe;
    const ownerAddress = owner?.toLowerCase() || "";
    console.log(recipe);
    console.log(ownerAddress);

    // Extract and format attributes using useMemo (optimizes performance)
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

    // Function to send a tip to the chef
    const tipChef = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask to send tips.");
            return;
        }

        if (!ethers.isAddress(ownerAddress)) {
            alert("Invalid recipient address.");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const network = await provider.getNetwork();

            if (network.chainId !== 80002) { // Polygon Amoy testnet Chain ID
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0x13882" }], // 80002 in hex
                });
            }

            const tx = await signer.sendTransaction({
                to: ownerAddress,
                value: ethers.parseEther("0.01"), // Sends 0.01 MATIC as a tip
                gasLimit: 21000 // Set gas limit explicitly
            });
            
            await tx.wait();
            alert("Tip sent successfully!");
        } catch (error) {
            console.error("Transaction failed:", error);
            alert("Failed to send tip: " + (error.message || error));
        }
    };

    return (
        <div>
            <h2>{metadata.name}</h2>
            <p>{metadata.description}</p>
            
            <h3>Ingredients</h3>
            <ul>{ingredients}</ul>
            
            <h3>Steps</h3>
            <ol>{steps}</ol>

            {/* Show "Tip Chef" button only if the user is NOT the owner */}
            {(!token || userAddress !== ownerAddress) && (
                <button onClick={tipChef}>Tip Chef</button>
            )}
        </div>
    );
};

export default Recipe;
