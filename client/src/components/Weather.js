/**
 * Weather.js
 *
 * This component handles fetching and displaying detailed weather information.
 * It includes current weather with icons, "Real Feel", forecast information,
 * and air quality data (new addition).
 * It also includes a production mode check to warn users if the API is not available.
 */
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Weather.css';

// API URL from environment variables, with a fallback
const API_URL = process.env.REACT_APP_API_URL || '';
const isProduction = process.env.NODE_ENV === 'production';

function Weather() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const navigate = useNavigate();

  // Fetch weather data from the API
  const fetchWeatherData = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to fetch weather data');
      }

      const url = `${API_URL}/api/weather/weatherdata`;
      const response = await axios.get(url, {
        params: { location },
        headers: { Authorization: `Bearer ${token}` }
      });

      setWeatherData(response.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching weather data:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          localStorage.removeItem('token');
          setError('Your session has expired. Please log in again.');
          setTimeout(() => navigate('/'), 3000);
        } else if (error.response.status === 404) {
          setError('Location not found. Please check the spelling and try again.');
        } else {
          setError(error.response.data.message || 'An error occurred while fetching weather data.');
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError('Unable to reach the weather service. Please check your internet connection and try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An unexpected error occurred. Please try again later.');
      }
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, [location, navigate]);

  // Check for token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location.trim()) {
      setError('Please enter a location.');
      return;
    }
    await fetchWeatherData();
  };

  // Refresh weather data
  const handleRefresh = async () => {
    if (location) {
      await fetchWeatherData();
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Get weather icon URL
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Format date and time
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return {
      date: date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
  };

  // New function to get air quality description
  const getAirQualityDescription = (aqi) => {
    const descriptions = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    return descriptions[aqi - 1] || 'Unknown';
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
        {isProduction && !API_URL && (
          <p className="warning">
            Note: This is a production build. If you haven't hosted the API, weather data won't be available.
          </p>
        )}
        <form onSubmit={handleSubmit} className="weather-form">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            required
          />
          <button type="submit" disabled={loading || (isProduction && !API_URL)} className="fancy-button">
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
            {/* New section for air quality data */}
            {weatherData.airQuality && (
              <div className="air-quality-info">
                <h3>Air Quality</h3>
                <p className="aqi-value">
                  AQI: {weatherData.airQuality.aqi} - {getAirQualityDescription(weatherData.airQuality.aqi)}
                </p>
                <div className="aqi-components">
                  <p>CO: {weatherData.airQuality.components.co} μg/m³</p>
                  <p>NO: {weatherData.airQuality.components.no} μg/m³</p>
                  <p>NO2: {weatherData.airQuality.components.no2} μg/m³</p>
                  <p>O3: {weatherData.airQuality.components.o3} μg/m³</p>
                  <p>SO2: {weatherData.airQuality.components.so2} μg/m³</p>
                  <p>PM2.5: {weatherData.airQuality.components.pm2_5} μg/m³</p>
                  <p>PM10: {weatherData.airQuality.components.pm10} μg/m³</p>
                </div>
              </div>
            )}
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
