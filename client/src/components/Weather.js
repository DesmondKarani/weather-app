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
  const [weatherData, setWeatherData] = useState(null);
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to fetch weather data');
      }

      const response = await axios.get('/api/weather/weatherdata', {
        params: { location },
        headers: { Authorization: `Bearer ${token}` }
      });

      setWeatherData(response.data);
      setLastUpdated(new Date());
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Error fetching weather data');
      setWeatherData(null);
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

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return {
      date: date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
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
        {weatherData && (
          <div className="weather-info">
            <h2>Current Weather in {weatherData.location.name}, {weatherData.location.country}</h2>
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
              <img src={getWeatherIcon(weatherData.current.icon)} alt={weatherData.current.description} className="weather-icon" />
              <div className="temperature-description">
                <p className="temperature">{Math.round(weatherData.current.temperature)}°C</p>
                <p className="description">{weatherData.current.description}</p>
              </div>
            </div>
            <div className="additional-info">
              <div className="info-item">
                <span className="info-label">Real Feel:</span>
                <span className="info-value">{Math.round(weatherData.current.feelsLike)}°C</span>
              </div>
              <div className="info-item">
                <span className="info-label">Humidity:</span>
                <span className="info-value">{weatherData.current.humidity}%</span>
              </div>
              <div className="info-item">
                <span className="info-label">Wind Speed:</span>
                <span className="info-value">{weatherData.current.windSpeed} m/s</span>
              </div>
            </div>
          </div>
        )}
        {weatherData && weatherData.forecast && (
          <div className="forecast-info">
            <h3>5-Day Forecast for {weatherData.location.name}, {weatherData.location.country}</h3>
            <div className="forecast-list">
              {weatherData.forecast.slice(0, 40, 8).map((item, index) => {
                const { date, time } = formatDateTime(item.dt);
                return (
                  <div key={index} className="forecast-item">
                    <p className="forecast-date">{date}</p>
                    <p className="forecast-time">{time}</p>
                    <img src={getWeatherIcon(item.icon)} alt={item.description} className="forecast-icon" />
                    <p className="forecast-temp">{Math.round(item.temp)}°C</p>
                    <p className="forecast-description">{item.description}</p>
                  </div>
                );
              })}
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
