import React, { useState } from "react";
import { authenticateWithMetaMask } from "../services/metamaskServices";
import { Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

const MetaMaskAuth = ({ onAuthSuccess }) => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleAuth = async () => {
        if (!name.trim()) {
            setError("Please enter your name.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const authData = await authenticateWithMetaMask(name);
            console.log("Authentication successful:", authData);
            setAddress(authData.address);
            toast.success("Successfully connected!");
            onAuthSuccess(authData);
            navigate("/profile");
        } catch (err) {
            console.error("Authentication error:", err);
            setError(err.message);
            toast.error(err.message);
            localStorage.removeItem("user_token");
            localStorage.removeItem("username");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Connect Your Wallet
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in with MetaMask to access your recipes
                    </p>
                </div>
                {address ? (
                    <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-green-600 font-medium text-center">
                            Connected: {address}
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Your Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>
                        <button
                            onClick={handleAuth}
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Connecting...
                                </div>
                            ) : (
                                <>
                                    <Wallet className="h-5 w-5" />
                                    Sign in with MetaMask
                                </>
                            )}
                        </button>
                        {error && (
                            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-600 text-center">{error}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MetaMaskAuth;
