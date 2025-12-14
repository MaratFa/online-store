import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/userSlice";
import "./Header.css";

export const Header: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  const { totalItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    dispatch(logout());
    navigate("/");
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
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/orders">Orders</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="logout-btn">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/account">Account</Link>
                </li>
              )}
            </ul>
          </nav>
          <div className="header-actions">
            <button className="search-btn">
              <i className="fas fa-search"></i>
            </button>
            <Link to="/cart" className="cart-btn">
              <i className="fas fa-shopping-cart"></i>
              <span className="cart-count">{totalItems || 0}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
