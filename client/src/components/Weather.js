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
  const [lastUpdated, setLastUpdated] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const fetchWeatherData = async () => {
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
        throw new Error('Location not found! Please Type Correctly...');
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

      // Fetch forecast
      const forecastResponse = await axios.get('/api/weather/forecast', {
        params: { lat, lon },
        headers: { Authorization: `Bearer ${token}` }
      });
      setForecast(forecastResponse.data);

      setLastUpdated(new Date());
    } catch (error) {
      setError(error.message || 'Error fetching weather data');
      // Clear weather data when there's an error
      setCurrentWeather(null);
      setForecast(null);
      setLastUpdated(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchWeatherData();
  };

  const handleRefresh = async () => {
    if (location) {
      await fetchWeatherData();
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
        <h2>Search Location</h2>
        <form onSubmit={handleSubmit} className="weather-form">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            required
          />
          <button type="submit" disabled={loading} className="fancy-button">
            {loading ? 'Loading...' : 'Get Weather'}
          </button>
        </form>
        {error && <p className="error-message red-text">{error}</p>}
        {currentWeather && (
          <div className="weather-info">
            <h2>Current Weather in {location}</h2>
            <div className="update-info">
              <p className="current-time">
                As of {lastUpdated ? lastUpdated.toLocaleTimeString() : 'N/A'}
                <button
                  onClick={handleRefresh}
                  className="refresh-button"
                  disabled={loading}
                  aria-label="Refresh weather data"
                >
                  🔄
                </button>
              </p>
            </div>
            <div className="weather-details">
              <img src={getWeatherIcon(currentWeather.icon)} alt={currentWeather.description} className="weather-icon" />
              <div className="temperature-description">
                <p className="temperature">{Math.round(currentWeather.temperature)}°C</p>
                <p className="description">{currentWeather.description}</p>
              </div>
            </div>
            <div className="additional-info">
              <div className="info-item">
                <span className="info-label">Real Feel:</span>
                <span className="info-value">{Math.round(currentWeather.feelsLike)}°C</span>
              </div>
              <div className="info-item">
                <span className="info-label">Humidity:</span>
                <span className="info-value">{currentWeather.humidity}%</span>
              </div>
              <div className="info-item">
                <span className="info-label">Wind Speed:</span>
                <span className="info-value">{currentWeather.windSpeed} m/s</span>
              </div>
            </div>
          </div>
        )}
        {forecast && (
          <div className="forecast-info">
            <h3>5-Day Forecast</h3>
            <div className="forecast-list">
              {forecast.slice(0, 40, 8).map((item, index) => (
                <div key={index} className="forecast-item">
                  <p className="forecast-date">{new Date(item.dt * 1000).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  <img src={getWeatherIcon(item.icon)} alt={item.description} className="forecast-icon" />
                  <p className="forecast-temp">{Math.round(item.temp)}°C</p>
                  <p className="forecast-description">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <footer className="copyright">
          <p>&copy; {new Date().getFullYear()} Designed by Desmond Karani. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Weather;
