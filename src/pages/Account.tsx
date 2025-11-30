import React, { useState } from 'react';
import './Account.css';

export const Account: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div className="account-section">
      <div className="container">
        <div className="account-form-container">
          <div className="account-tabs">
            <button 
              className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button 
              className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'login' && (
              <div className="tab-pane active">
                <form className="account-form">
                  <h2>Login to Your Account</h2>
                  <div className="form-group">
                    <label htmlFor="login-email">Email</label>
                    <input type="email" id="login-email" autoComplete="username" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="login-password">Password</label>
                    <input type="password" id="login-password" autoComplete="current-password" required />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Login</button>
                    <a href="#" className="forgot-password">Forgot Password?</a>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'register' && (
              <div className="tab-pane active">
                <form className="account-form">
                  <h2>Create an Account</h2>
                  <div className="form-group">
                    <label htmlFor="register-name">Full Name</label>
                    <input type="text" id="register-name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="register-email">Email</label>
                    <input type="email" id="register-email" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="register-password">Password</label>
                    <input type="password" id="register-password" autoComplete="new-password" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="register-confirm-password">Confirm Password</label>
                    <input type="password" id="register-confirm-password" autoComplete="new-password" required />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Register</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
