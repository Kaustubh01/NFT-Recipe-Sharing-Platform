import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { logout, authenticateWithMetaMask } from '../services/metamaskServices';
import "../styles/components/navbar.css"

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
    <div className='navbar'>
      <div className="logo"></div>
      <div className="navigation">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/store">Menu</Link></li>
        </ul>
      </div>
      <div className="actions">
      {isAuthenticated ? (
        <button onClick={handleLogout} style={{ marginLeft: '10px', cursor: 'pointer' }}>
          Logout
        </button>
      ) : (
        <button onClick={handleLogin} style={{ marginLeft: '10px', cursor: 'pointer' }}>
          Login
        </button>
        
      )}
      <Link to="/profile">Profile</Link>
      </div>
      

    </div>
  );
};

export default Navbar;
