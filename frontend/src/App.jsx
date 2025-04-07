import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NFTProvider } from "./contexts/NFTContext";
import { UserProvider } from "./contexts/UserContext";
import { ProtectedRoutes } from "./routes/ProtectedRoutes";
import { Toaster } from 'react-hot-toast';

import Navbar from "./components/Navbar";
import MetaMaskAuth from "./components/MetaMaskAuth";
import Store from "./pages/Store";
import MintRecipe from "./components/MintRecipe";
import UserProfile from "./pages/UserProfile";
import Recipe from "./pages/Recipe";
import Landing from "./pages/Landing";
import Footer from "./components/Footer";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  exit: { opacity: 0 },
};

function App() {
  const location = useLocation();
  const [authData, setAuthData] = useState(null);

  const handleAuthSuccess = (data) => {
    setAuthData(data);
    window.dispatchEvent(new Event("authStateChanged"));
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
      <Navbar />
      <NFTProvider>
        <UserProvider>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <motion.div 
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <Landing />
                </motion.div>
              } />
              
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

              <Route path="/register" element={
                <motion.div 
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <MetaMaskAuth onAuthSuccess={handleAuthSuccess} />
                </motion.div>
              } />

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
                
                <Route path="/profile" element={
                  <motion.div 
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                  >
                    <UserProfile />
                  </motion.div>
                } />

                <Route path="/recipe" element={
                  <motion.div 
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                  >
                    <Recipe />
                  </motion.div>
                } />
              </Route>
            </Routes>
          </AnimatePresence>
        </UserProvider>
      </NFTProvider>
      <Footer />
    </>
  );
}

export default App;
