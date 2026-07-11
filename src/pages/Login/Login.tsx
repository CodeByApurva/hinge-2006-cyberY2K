import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('alex.johnson');
  const [password, setPassword] = useState('hinge2006');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both your screen name and password.');
      return;
    }

    setIsLoading(true);

    // Simulate 2006 slow dial-up connection check
    setTimeout(() => {
      const success = login(username, password);
      setIsLoading(false);
      if (!success) {
        setError('Invalid username or password. (Hint: Use default or any username/password = "hinge2006")');
      }
    }, 1200);
  };

  return (
    <div className="login-screen">
      <div className="xp-login-container">
        {/* Top title bar */}
        <div className="xp-login-header">
          <div className="xp-login-logo">
            <svg width="24" height="24" viewBox="0 0 32 32">
              <defs>
                <linearGradient id="lbg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6FC3FF" />
                  <stop offset="55%" stopColor="#2F7BFF" />
                  <stop offset="100%" stopColor="#23E7FF" />
                </linearGradient>
              </defs>
              <rect width="32" height="32" rx="7" fill="url(#lbg)" />
              <text x="16" y="23" textAnchor="middle" fontFamily="Orbitron,Rajdhani,sans-serif" fontWeight="700" fontSize="18" fill="white">H</text>
            </svg>
            <span className="xp-login-logo-text">Hinge 2006</span>
          </div>
          <div className="xp-login-version">Desktop Edition v1.0</div>
        </div>

        {/* Main Content split into left and right */}
        <div className="xp-login-body">
          <div className="xp-login-body-left">
            <div className="xp-welcome-text">To begin, click your user name or type your sign-in credentials.</div>
            <div className="xp-welcome-subtitle">Hinge helps you find meaningful connections through an advanced matchmaking interface.</div>
            <div className="xp-avatar-list">
              <div className="xp-avatar-item active">
                <div className="xp-avatar-box">AJ</div>
                <div className="xp-avatar-details">
                  <div className="xp-avatar-name">Alex Johnson</div>
                  <div className="xp-avatar-status">Default Account</div>
                </div>
              </div>
            </div>
          </div>

          <div className="xp-login-divider-vertical" />

          <div className="xp-login-body-right">
            <form onSubmit={handleSubmit} className="xp-login-form">
              {error && <div className="xp-login-error">{error}</div>}
              
              <div className="xp-form-group">
                <label htmlFor="username">Sign-in Name:</label>
                <input 
                  type="text" 
                  id="username" 
                  className="xp-input xp-input--large"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="xp-form-group">
                <label htmlFor="password">Password:</label>
                <input 
                  type="password" 
                  id="password" 
                  className="xp-input xp-input--large"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="xp-form-options">
                <label className="xp-checkbox">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span>Remember my password</span>
                </label>
              </div>

              <div className="xp-login-actions">
                <button 
                  type="submit" 
                  className="xp-btn xp-btn--primary xp-btn--large xp-login-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="d-flex align-center gap-8">
                      <div className="xp-loading__spinner" style={{ width: 12, height: 12 }} />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <span>Sign In ›</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="xp-login-footer">
          <div className="xp-login-footer-links">
            <a href="#help" onClick={(e) => { e.preventDefault(); alert("Use screen name 'alex.johnson' and password 'hinge2006' to sign in!"); }}>Need help signing in?</a>
            <span> | </span>
            <a href="#register" onClick={(e) => { e.preventDefault(); alert("Registration is currently simulated. Any name and password = 'hinge2006' will log you in."); }}>Create a new account</a>
          </div>
          <div className="xp-turnoff">
            <span className="xp-turnoff-btn">⏻</span>
            <span>Turn off Hinge</span>
          </div>
        </div>
      </div>
    </div>
  );
}
