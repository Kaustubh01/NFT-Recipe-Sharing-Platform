import React, { useState } from "react";
import { authenticateWithMetaMask } from "../services/metamaskServices";
import '../styles/components/metamaskAuth.css'

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
        <div className="page">
            <div className="signup">
                {address ? (
                    <p className="text-green-600 font-bold">Connected: {address}</p>
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="name"
                        />
                        <button
                            onClick={handleAuth}
                            className="button"
                            disabled={loading}
                        >
                            {loading ? "Connecting..." : "Sign in with MetaMask"}
                        </button>
                        {error && <p className="error">{error}</p>}
                    </>
                )}
            </div>
        </div>
    );
};

export default MetaMaskAuth;
