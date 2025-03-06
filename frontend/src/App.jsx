import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MintRecipe from "./components/MintRecipe";
import { NFTProvider } from "./contexts/NFTContext";
import Navbar from "./components/Navbar";
import MetaMaskAuth from "./components/MetaMaskAuth";
import { ProtectedRoutes } from "./routes/ProtectedRoutes";
import UserProfile from "./pages/UserProfile";

function App() {
    return (
        <>
            <Navbar />
            <NFTProvider>

                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/register" element={<MetaMaskAuth />} />
                    <Route element={<ProtectedRoutes/>}>
                        <Route path="/mint-recipe" element={<MintRecipe/>} />
                        <Route path="/profile" element={<UserProfile/>}/>
                    </Route>
                </Routes>

            </NFTProvider>
        </>
    );
}

export default App;
