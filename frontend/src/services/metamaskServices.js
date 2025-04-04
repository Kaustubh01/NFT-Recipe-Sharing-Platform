import { ethers } from "ethers";

const authenticateWithMetaMask = async (name = null) => {  
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
    if (name) { 
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

    localStorage.setItem("token", data.token);

    return userAddress;
};



const logout = () => {
    localStorage.removeItem("token");
    window.location.reload(); 
};

export {authenticateWithMetaMask, logout}