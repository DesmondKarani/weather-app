/**
 * LandingPage.js
 * 
 * This component serves as the main entry point for users.
 * It handles user login and provides a link to register.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function LandingPage() {
  // State management for form inputs and messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // Check for success message from registration
  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage);
    }
  }, [location]);

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setSuccessMessage(response.data.message);
      setTimeout(() => navigate('/weather'), 2000); // Navigate after 2 seconds
    } catch (error) {
      setError(error.response?.status === 401
        ? 'Invalid email or password. Please try again or register.'
        : 'Login failed. Please try again.');
    }
  };

  // Navigate to registration page
  const handleRegisterClick = () => navigate('/register');

  return (
    <div>
      <h1>Welcome to Weather-Now</h1>
      <p>Please log in below to access weather information.</p>
      {successMessage && <p style={{color: 'green'}}>{successMessage}</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <button onClick={handleRegisterClick}>Register</button>
    </div>
  );
}

export default LandingPage;
