/**
 * Weather.js
 *
 * This component handles fetching and displaying detailed weather information.
 * It includes current weather with icons, "Real Feel", forecast information,
 * and air quality data.
 * It also includes a production mode check to warn users if the API is not available.
 * Features: personalized welcome message, location suggestions with autocomplete,
 * debounced weather data fetching, and improved search functionality.
 * Latest updates: Refined search input and suggestions display.
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Weather.css';
import { debounce } from 'lodash';

const API_URL = process.env.REACT_APP_API_URL || '';
const isProduction = process.env.NODE_ENV === 'production';

function Weather() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [username, setUsername] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  const fetchSuggestions = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to fetch suggestions');
      }

      const url = `${API_URL}/api/weather/suggestions`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    fetchSuggestions();

    // Load dark mode preference from local storage
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode !== null) {
      setDarkMode(JSON.parse(storedDarkMode));
    }
  }, [fetchSuggestions]);

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting;
    if (hour < 12) greeting = "Good morning";
    else if (hour < 18) greeting = "Good afternoon";
    else greeting = "Good evening";
    return `${greeting}, ${username}`;
  };

  const fetchWeatherData = useCallback(async (searchLocation) => {
    setError('');
    setLoading(true);
    setWeatherData(null); // Clear old data

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to fetch weather data');
      }

      const url = `${API_URL}/api/weather/weatherdata`;
      const response = await axios.get(url, {
        params: { location: searchLocation },
        headers: { Authorization: `Bearer ${token}` }
      });

      setWeatherData(response.data);
      setLastUpdated(new Date());
      await fetchSuggestions(); // Update suggestions after successful fetch
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError(error.response?.data?.message || 'Error fetching weather data');
    } finally {
      setLoading(false);
    }
  }, [fetchSuggestions]);

  const debouncedFetchWeather = useMemo(
    () => debounce((searchLocation) => fetchWeatherData(searchLocation), 300),
    [fetchWeatherData]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location.trim()) {
      setError('Please enter a location.');
      return;
    }
    await fetchWeatherData(location);
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    setLocation(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion);
    setShowSuggestions(false);
    debouncedFetchWeather(suggestion);
  };

  const handleRefresh = async () => {
    if (location) {
      await fetchWeatherData(location);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return {
      date: date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
  };

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
        {username && <h2 className="welcome-message">{getWelcomeMessage()}</h2>}
        {isProduction && !API_URL && (
          <p className="warning">
            Note: This is a production build. If you haven't hosted the API, weather data won't be available.
          </p>
        )}
        <form onSubmit={handleSubmit} className="weather-form">
          <div className="search-container">
            <input
              type="text"
              value={location}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search your Address, City, or Zip Code"
              required
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-wrapper">
                <p className="suggestions-label">Recents</p>
                <ul className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button type="submit" disabled={loading || (isProduction && !API_URL)} className="fancy-button">
            {loading ? 'Loading...' : 'Get Weather'}
          </button>
        </form>
        {loading && <p>Loading weather data...</p>}
        {error && <p className="error-message">{error}</p>}
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
