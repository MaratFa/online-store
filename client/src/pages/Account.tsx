import React, { useState } from 'react';
import { Button, Input } from '../components/ui';
import './Account.css';

export const Account: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginMessage, setLoginMessage] = useState<string>('');
  const [registerMessage, setRegisterMessage] = useState<string>('');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  
  // Register form state
  const [registerName, setRegisterName] = useState<string>('');
  const [registerEmail, setRegisterEmail] = useState<string>('');
  const [registerPassword, setRegisterPassword] = useState<string>('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState<string>('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Simple validation
    if (!loginEmail || !loginPassword) {
      setLoginMessage('Please fill in all fields');
      return;
    }

    // For demo purposes, we'll just show a success message
    // In a real app, you would send this to a server
    setLoginMessage(`Login successful! Welcome ${loginEmail}`);

    // Store user email and name in localStorage to simulate authentication
    localStorage.setItem('userEmail', loginEmail);
    localStorage.setItem('userName', loginEmail.split('@')[0]); // Use part of email as name

    // Redirect to dashboard after successful login
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1500);

    // In a real app, you might redirect the user or update the UI state
    console.log('Login attempt with:', { email: loginEmail, password: loginPassword });
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Simple validation
    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      setRegisterMessage('Please fill in all fields');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setRegisterMessage('Passwords do not match');
      return;
    }

    // For demo purposes, we'll just show a success message
    // In a real app, you would send this to a server
    setRegisterMessage(`Registration successful! Welcome ${registerName}`);

    // In a real app, you might redirect the user or update the UI state
    console.log('Registration attempt with:', { name: registerName, email: registerEmail, password: registerPassword });
  };

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
                <form className="account-form" onSubmit={handleLogin}>
                  <h2>Login to Your Account</h2>
                  {loginMessage && <div className="form-message">{loginMessage}</div>}
                  <Input
                    type="email"
                    id="login-email"
                    label="Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    autoComplete="username"
                    required
                  />
                  <Input
                    type="password"
                    id="login-password"
                    label="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <div className="form-actions">
                    <Button type="submit" variant="primary">Login</Button>
                    <a href="#" className="forgot-password">Forgot Password?</a>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'register' && (
              <div className="tab-pane active">
                <form className="account-form" onSubmit={handleRegister}>
                  <h2>Create an Account</h2>
                  {registerMessage && <div className="form-message">{registerMessage}</div>}
                  <Input
                    type="text"
                    id="register-name"
                    label="Full Name"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                  />
                  <Input
                    type="email"
                    id="register-email"
                    label="Email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    id="register-password"
                    label="Password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <Input
                    type="password"
                    id="register-confirm-password"
                    label="Confirm Password"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <div className="form-actions">
                    <Button type="submit" variant="primary">Register</Button>
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
