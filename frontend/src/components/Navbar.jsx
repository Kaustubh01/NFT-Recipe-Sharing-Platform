import React from 'react';
import { Link } from 'react-router-dom';
import { logout, authenticateWithMetaMask } from '../services/metamaskServices'; // Import the logout function

const Navbar = () => {
  return (
    <div>
      <Link to='/mint-recipe'>Mint Your Recipe</Link>
      <Link to='/profile'>Profile</Link>

      {/* Logout Button */}
      <button onClick={logout} style={{ marginLeft: '10px', cursor: 'pointer' }}>
        Logout
      </button>
      <button onClick={authenticateWithMetaMask} style={{ marginLeft: '10px', cursor: 'pointer' }}>
        Login
      </button>
    </div>
  );
};

export default Navbar;
