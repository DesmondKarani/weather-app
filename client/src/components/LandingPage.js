import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function LandingPage() {
  // State variables for form inputs, error, and success messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Hooks for navigation and location
  const navigate = useNavigate();
  const location = useLocation();

  // Effect to handle success message from registration
  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage);
    }
  }, [location]);

  // Handler for login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setSuccessMessage(response.data.message); // Set success message from login response
      setTimeout(() => navigate('/weather'), 2000); // Navigate after showing message for 2 seconds
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Invalid email or password. Please try again or register.');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  // Handler for register button click
  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div>
      <h1>Welcome to Weather-Now</h1>
      <p>Please log in below to access weather information.</p>
      {successMessage && <p style={{color: 'green'}}>{successMessage}</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleLogin}>
        {/* Email input field */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        {/* Password input field */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {/* Login button */}
        <button type="submit">Login</button>
      </form>
      {/* Register button */}
      <button onClick={handleRegisterClick}>Register</button>
    </div>
  );
}

export default LandingPage;
