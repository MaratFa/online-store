import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    // In a real app, you would get this from your authentication system
    // For demo purposes, we'll just use a placeholder
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const handleLogout = () => {
    // In a real app, you would clear authentication tokens
    localStorage.removeItem('userEmail');
    // Redirect to home page
    window.location.href = '/';
  };

  return (
    <div className="dashboard">
      <section className="dashboard-header">
        <div className="container">
          <h1>User Dashboard</h1>
          <p className="welcome-message">Welcome back, {userEmail || 'User'}!</p>
        </div>
      </section>

      <section className="dashboard-content">
        <div className="container">
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h2>My Orders</h2>
              <p>View and track your recent orders</p>
              <Link to="/orders" className="dashboard-link">View Orders</Link>
            </div>

            <div className="dashboard-card">
              <h2>Profile Settings</h2>
              <p>Manage your account information</p>
              <Link to="/profile" className="dashboard-link">Edit Profile</Link>
            </div>

            <div className="dashboard-card">
              <h2>Wishlist</h2>
              <p>View your saved products</p>
              <Link to="/wishlist" className="dashboard-link">View Wishlist</Link>
            </div>

            <div className="dashboard-card">
              <h2>Payment Methods</h2>
              <p>Manage your payment options</p>
              <Link to="/payment" className="dashboard-link">Manage Payments</Link>
            </div>
          </div>

          <div className="dashboard-actions">
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
