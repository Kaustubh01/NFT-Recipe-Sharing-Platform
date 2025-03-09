import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { logout, authenticateWithMetaMask } from '../services/metamaskServices';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, []);

  const handleLogin = async () => {
    try {
      await authenticateWithMetaMask();
      setIsAuthenticated(true); // Update UI on successful login
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  return (
    <div>
      <Link to="/mint-recipe">Mint Your Recipe</Link>
      <Link to="/profile">Profile</Link>

      {/* Conditional Rendering for Login/Logout */}
      {isAuthenticated ? (
        <button onClick={handleLogout} style={{ marginLeft: '10px', cursor: 'pointer' }}>
          Logout
        </button>
      ) : (
        <button onClick={handleLogin} style={{ marginLeft: '10px', cursor: 'pointer' }}>
          Login
        </button>
      )}
    </div>
  );
};

export default Navbar;
