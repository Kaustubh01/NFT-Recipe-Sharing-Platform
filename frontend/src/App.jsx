import React from "react";
import { Route, Routes } from "react-router-dom";
import Store from "./pages/Store";
import MintRecipe from "./components/MintRecipe";
import { NFTProvider } from "./contexts/NFTContext";
import Navbar from "./components/Navbar";
import MetaMaskAuth from "./components/MetaMaskAuth";
import { ProtectedRoutes } from "./routes/ProtectedRoutes";
import UserProfile from "./pages/UserProfile";
import { UserProvider } from "./contexts/UserContext";
import Recipe from "./pages/Recipe";
import Landing from "./pages/Landing";

function App() {
    return (
        <>
            <Navbar />
            <NFTProvider>
                <UserProvider>
                    <Routes>
                        <Route path="/" element= {<Landing/>}/>
                        <Route path="/store" element={<Store />} />
                        <Route path="/register" element={<MetaMaskAuth />} />
                        <Route element={<ProtectedRoutes />}>
                            <Route path="/mint-recipe" element={<MintRecipe />} />
                            <Route path="/profile" element={<UserProfile />} />
                        </Route>
                        <Route path="/recipe" element= {<Recipe/>} />
                    </Routes>

                </UserProvider>

            </NFTProvider>
        </>
    );
}

export default App;
