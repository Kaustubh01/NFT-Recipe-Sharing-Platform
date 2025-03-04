import React, { useState } from "react";
import { ethers } from "ethers";

const MetaMaskAuth = ({ onAuthSuccess }) => {
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const authenticateWithMetaMask = async () => {
        setLoading(true);
        setError("");

        try {
            if (!window.ethereum) {
                throw new Error("MetaMask is not installed!");
            }

            // Request account access
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            if (!accounts || accounts.length === 0) {
                throw new Error("No Ethereum account found.");
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const userAddress = await signer.getAddress();

            // Send address to backend (No signature required)
            const response = await fetch("http://localhost:5000/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address: userAddress }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Authentication failed.");
            }

            // Store JWT token in localStorage
            localStorage.setItem("token", data.token);
            setAddress(userAddress);
            onAuthSuccess(userAddress); // Callback to notify parent component
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-xl shadow-md">
            {address ? (
                <p className="text-green-600 font-bold">Connected: {address}</p>
            ) : (
                <>
                    <button
                        onClick={authenticateWithMetaMask}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                        disabled={loading}
                    >
                        {loading ? "Connecting..." : "Sign in with MetaMask"}
                    </button>
                    {error && <p className="text-red-600 mt-2">{error}</p>}
                </>
            )}
        </div>
    );
};

export default MetaMaskAuth;
