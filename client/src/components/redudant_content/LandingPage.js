/**
 * LandingPage.js
 * 
 * This component serves as the main entry point for users.
 * It handles user login and provides a link to register.
 * The component now includes a weather-related background and centered content.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

// Import the CSS file for custom styles
import './LandingPage.css';

function LandingPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage);
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setSuccessMessage(response.data.message);
      setTimeout(() => navigate('/weather'), 2000);
    } catch (error) {
      setError(error.response?.status === 401
        ? 'Invalid email or password. Please try again or register.'
        : 'Login failed. Please try again.');
    }
  };

  const handleRegisterClick = () => navigate('/register');

  return (
    <div className="landing-page">
      <div className="content-container">
        <h1>Welcome to Weather-Now</h1>
        <p>Please log in below to access weather information.</p>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" className="login-button">Login</button>
        </form>
        <button onClick={handleRegisterClick} className="register-button">Register</button>
      </div>
    </div>
  );
}

export default LandingPage;
