import React, { useState } from 'react';
import "./Login.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import skLogo from "../Images/png[3].png"
import { useNavigate } from 'react-router-dom';

const SignInForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Static login validation
    if (email === 'admin@gmail.com' && password === 'admin@123') {
      console.log('Login successful');
      // Here you can add redirect logic or state update for successful login

      alert('Login successful!');

      navigate("/dashboard")

    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="signin-wrapper-main">
      <div className="signin-card-container">
        {/* Logo at the top */}
        <div className="signin-logo-container">
          <img 
            src= {skLogo} 
            alt="SK Tours Logo" 
            className="signin-logo"
          />
        </div>

        {/* Removed "Sign In" title as requested */}
        <p className="signin-header-subtitle">Enter your credentials to continue</p>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="signin-input-group">
            <input
              type="email"
              className="signin-input-field"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="signin-input-group">
            <div className="signin-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="signin-input-field"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="signin-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="signin-options-row">
            <div className="signin-remember-checkbox">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe" className="signin-remember-label">
                Remember me
              </label>
            </div>
            <a href="#forgot" className="signin-forgot-link">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="signin-submit-button">
            Sign In
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default SignInForm;