import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Weather() {
  // State variables
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Effect to check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // First, get coordinates for the location
      console.log('Fetching coordinates for:', location);
      const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
        params: {
          q: location,
          limit: 1,
          appid: process.env.REACT_APP_OPENWEATHERMAP_API_KEY
        }
      });

      if (geoResponse.data.length === 0) {
        console.log('Location not found');
        setError('Location not found');
        return;
      }

      const { lat, lon } = geoResponse.data[0];
      console.log('Coordinates:', { lat, lon });

      // Get the authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No authentication token found');
        setError('Please log in to fetch weather data');
        return;
      }

      // Now get the weather data
      console.log('Fetching weather data');
      const weatherResponse = await axios.get('/api/weather/current', {
        params: { lat, lon },
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Weather data received:', weatherResponse.data);
      setWeather(weatherResponse.data);
    } catch (error) {
      console.error('Weather fetch error:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : 'Error fetching weather data');
    }
  };

  // Handler for logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      <h1>Weather Information</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
          required
        />
        <button type="submit">Get Weather</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {weather && (
        <div>
          <h2>{location}</h2>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Description: {weather.description}</p>
          <p>Humidity: {weather.humidity}%</p>
          <p>Wind Speed: {weather.windSpeed} m/s</p>
        </div>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Weather;
