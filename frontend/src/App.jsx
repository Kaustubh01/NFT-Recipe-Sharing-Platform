import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NFTProvider } from "./contexts/NFTContext";
import { UserProvider } from "./contexts/UserContext";
import { ProtectedRoutes } from "./routes/ProtectedRoutes";

import Navbar from "./components/Navbar";
import MetaMaskAuth from "./components/MetaMaskAuth";
import Store from "./pages/Store";
import MintRecipe from "./components/MintRecipe";
import UserProfile from "./pages/UserProfile";
import Recipe from "./pages/Recipe";
import Landing from "./pages/Landing";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  exit: { opacity: 0 },
};

function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <NFTProvider>
        <UserProvider>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Landing />} />
              
              <Route path="/store" element={
                <motion.div 
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <Store />
                </motion.div>
              } />

              <Route path="/register" element={<MetaMaskAuth />} />

              <Route element={<ProtectedRoutes />}>
                <Route path="/mint-recipe" element={
                  <motion.div 
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                  >
                    <MintRecipe />
                  </motion.div>
                } />
                
                <Route path="/profile" element={<UserProfile />} />
              </Route>

              <Route path="/recipe" element={<Recipe />} />
            </Routes>
          </AnimatePresence>
        </UserProvider>
      </NFTProvider>
    </>
  );
}

export default App;
