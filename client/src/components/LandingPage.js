/**
 * LandingPage.js
 * 
 * This component serves as the main entry point for users.
 * It handles user login, provides a link to register, and includes a dark mode toggle.
 * The background image is now set using inline styles.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './LandingPage.css';
import backgroundImage from './weather-background.jpg';

function LandingPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage);
    }
    // Load dark mode preference from local storage
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode !== null) {
      setDarkMode(JSON.parse(storedDarkMode));
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      setSuccessMessage(response.data.message);
      setTimeout(() => navigate('/weather'), 2000);
    } catch (error) {
      setError(error.response?.status === 401
        ? 'Invalid email or password. Please try again or register.'
        : 'Login failed. Please try again.');
    }
  };

  const handleRegisterClick = () => navigate('/register');

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  return (
    <div 
      className={`landing-page ${darkMode ? 'dark-mode' : 'light-mode'}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="top-right-buttons">
        <button onClick={toggleDarkMode} className="mode-toggle fancy-button">
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
      <div className="content-container">
        <h1>Welcome to Wingu</h1>
        <p><i>Your personal weather companion.</i></p>
        <p>Please login below</p>
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
          <button type="submit" className="fancy-button">Login</button>
        </form>
        <button onClick={handleRegisterClick} className="fancy-button register-button">Register</button>
      </div>
    </div>
  );
}

export default LandingPage;
