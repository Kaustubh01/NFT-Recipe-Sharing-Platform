import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MintRecipe from "./components/MintRecipe";
import { NFTProvider } from "./contexts/NFTContext";

function App() {
    return (
        <NFTProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MintRecipe />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </BrowserRouter>
        </NFTProvider>
    );
}

export default App;
