import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, authenticateWithMetaMask } from '../services/metamaskServices';
import { Home, LogIn, Menu, User } from 'lucide-react';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const checkAuth = () => {
    const token = localStorage.getItem("user_token");
    setIsAuthenticated(!!token);
  };

  useEffect(() => {
    // Check initial authentication state
    checkAuth();

    // Listen for authentication state changes
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('authStateChanged', handleAuthChange);
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const handleLogin = async () => {
    navigate('/register');
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user_token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("authStateChanged"));
    navigate('/');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      <div className="flex items-center gap-2">
        <Link to="/">
          <img 
            src="/logo1.svg" 
            alt="CHOMP Logo" 
            className="h-14 w-auto"
          />
        </Link>
      </div>
      <div className="hidden md:flex items-center gap-8">
        <Link to="/" className="font-medium text-orange-600 flex items-center gap-2">
          <Home className="h-5 w-5" />
          Home
        </Link>
        <Link to="/store" className="font-medium flex items-center gap-2">
          <Menu className="h-5 w-5" />
          Menu
        </Link>
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
              <User className="h-5 w-5" />
              Profile
            </Link>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <LogIn className="h-5 w-5" />
            Login
          </button>
        )}
      </div>
      <div className="flex md:hidden">
        <button className="p-2 hover:bg-gray-100 rounded-md">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
