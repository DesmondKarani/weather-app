/**
 * Weather.js
 * 
 * This component handles fetching and displaying detailed weather information.
 * It now includes current weather with icons, "Real Feel", and "Air Quality".
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Weather.css';

function Weather() {
  const [location, setLocation] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
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

      // Fetch current weather
      const currentWeatherResponse = await axios.get('/api/weather/current', {
        params: { lat, lon },
        headers: { Authorization: `Bearer ${token}` }
      });

      setCurrentWeather(currentWeatherResponse.data);

      // Fetch forecast (to be implemented)
      // const forecastResponse = await axios.get('/api/weather/forecast', {
      //   params: { lat, lon },
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // setForecast(forecastResponse.data);

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

  const getWeatherIcon = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div className={`weather-page ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="top-right-buttons">
        <button onClick={toggleDarkMode} className="mode-toggle fancy-button">
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
        <button onClick={handleLogout} className="logout-button fancy-button">
          Logout
        </button>
      </div>
      <div className="content-container">
        <h1>SkyCast Weather Information</h1>
        <form onSubmit={handleSubmit} className="weather-form">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            required
          />
          <button type="submit" disabled={loading} className="fancy-button">
            {loading ? 'Loading...' : 'Get Forecast'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {currentWeather && (
          <div className="weather-info">
            <h2>Current Weather in {location}</h2>
            <p className="current-time">As of {new Date().toLocaleTimeString()}</p>
            <div className="weather-details">
              <img src={getWeatherIcon(currentWeather.icon)} alt={currentWeather.description} className="weather-icon" />
              <p className="temperature">{Math.round(currentWeather.temperature)}°C</p>
              <p className="description">{currentWeather.description}</p>
            </div>
            <div className="additional-info">
              <p>Real Feel: {Math.round(currentWeather.feelsLike)}°C</p>
              <p>Humidity: {currentWeather.humidity}%</p>
              <p>Wind Speed: {currentWeather.windSpeed} m/s</p>
              <p>Air Quality: {currentWeather.airQuality || 'N/A'}</p>
            </div>
          </div>
        )}
        {/* Forecast section to be added later */}
      </div>
    </div>
  );
}

export default Weather;
