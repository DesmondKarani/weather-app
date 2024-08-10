/**
 * Weather.js
 * 
 * This component handles fetching and displaying weather information.
 * It includes a dark/light mode toggle.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Weather.css';

function Weather() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
        params: {
          q: location,
          limit: 1,
          appid: process.env.REACT_APP_OPENWEATHERMAP_API_KEY
        }
      });

      if (geoResponse.data.length === 0) {
        throw new Error('Location not found');
      }

      const { lat, lon } = geoResponse.data[0];
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please log in to fetch weather data');
      }

      const weatherResponse = await axios.get('/api/weather/current', {
        params: { lat, lon },
        headers: { Authorization: `Bearer ${token}` }
      });

      setWeather(weatherResponse.data);
    } catch (error) {
      setError(error.message || 'Error fetching weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`weather-page ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="content-container">
        <h1>Weather Information</h1>
        <form onSubmit={handleSubmit} className="weather-form">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Get Weather'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {weather && (
          <div className="weather-info">
            <h2>{location}</h2>
            <p>Temperature: {weather.temperature}°C</p>
            <p>Description: {weather.description}</p>
            <p>Humidity: {weather.humidity}%</p>
            <p>Wind Speed: {weather.windSpeed} m/s</p>
          </div>
        )}
        <button onClick={handleLogout} className="logout-button">Logout</button>
        <button onClick={toggleDarkMode} className="mode-toggle">
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </div>
  );
}

export default Weather;
