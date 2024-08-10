import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  // State variables for form inputs and error message
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Hook for programmatic navigation
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear any existing errors
    setError('');
    try {
      // Send POST request to register endpoint
      const response = await axios.post('/api/auth/register', { username, email, password });
      
      // Check if the response contains a token
      if (response.data.token) {
        // Store the received token in localStorage
        localStorage.setItem('token', response.data.token);
        
        // Navigate to the landing page with success message
        navigate('/', { state: { successMessage: response.data.message || "Registration successful" } });
      } else {
        // If no token is received, throw an error
        throw new Error('Registration successful, but no token received');
      }
    } catch (error) {
      // Set error message if registration fails
      if (error.response && error.response.data) {
        // Use the specific error message from the server if available
        setError(error.response.data.message);
      } else {
        // Fallback to a generic error message
        setError('Registration failed. Please try again.');
      }
      console.error('Registration error:', error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
