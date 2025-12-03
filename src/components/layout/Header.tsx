import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

export const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userEmail = localStorage.getItem('userEmail');
    setIsLoggedIn(userEmail !== null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    navigate('/');
  };
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            Online Store
          </Link>
          <nav className="main-nav">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              {isLoggedIn ? (
                <>
                  <li><Link to="/dashboard">Dashboard</Link></li>
                  <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
                </>
              ) : (
                <li><Link to="/account">Account</Link></li>
              )}
            </ul>
          </nav>
          <div className="header-actions">
            <button className="search-btn">
              <i className="fas fa-search"></i>
            </button>
            <Link to="/cart" className="cart-btn">
              <i className="fas fa-shopping-cart"></i>
              <span className="cart-count">0</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
