import React, { useState } from "react";
import { authenticateWithMetaMask } from "../services/metamaskServices";

const MetaMaskAuth = ({ onAuthSuccess }) => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAuth = async () => {
        if (!name.trim()) {
            setError("Please enter your name.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const userAddress = await authenticateWithMetaMask(name);
            setAddress(userAddress);
            onAuthSuccess(userAddress);
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
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md mb-3"
                    />
                    <button
                        onClick={handleAuth}
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
