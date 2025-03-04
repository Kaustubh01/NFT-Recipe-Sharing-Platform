import React, { useEffect, useState } from "react";
import MetaMaskAuth from "../components/MetaMaskAuth";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [userAddress, setUserAddress] = useState(null);
    const navigate = useNavigate()
    useEffect(() => {
        if (userAddress) {
            navigate("/dashboard"); // Redirect to the Dashboard or another page
        }
    }, [userAddress, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
            <h1 className="text-2xl font-bold mb-4">Welcome to MetaMask Auth</h1>
            <MetaMaskAuth onAuthSuccess={setUserAddress} />
            {userAddress && <p className="mt-4">Authenticated as: {userAddress}</p>}
        </div>
    );
};

export default Home;
