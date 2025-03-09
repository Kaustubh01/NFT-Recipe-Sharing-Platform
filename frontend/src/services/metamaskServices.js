import { ethers } from "ethers";

const authenticateWithMetaMask = async (name = null) => {  // Default name to null
    if (!window.ethereum) {
        throw new Error("MetaMask is not installed!");
    }

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    if (!accounts || accounts.length === 0) {
        throw new Error("No Ethereum account found.");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    const requestBody = { address: userAddress };
    if (name) { // Only include name if it is provided
        requestBody.name = name;
    }

    const response = await fetch("http://localhost:5000/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Authentication failed.");
    }

    // Store JWT token in localStorage
    localStorage.setItem("token", data.token);

    return userAddress;
};



const logout = () => {
    localStorage.removeItem("token"); // Remove authentication token
    window.location.reload(); // Refresh page to reset state
};

export {authenticateWithMetaMask, logout}