import React from "react";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MintRecipe from "./components/MintRecipe";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element = {<MintRecipe/>}/>
                <Route path="/dashboard" element = {<Dashboard/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
