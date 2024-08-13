const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/weatherdata', auth, async (req, res) => {
  console.log('Received weather data request');
  console.log('Query params:', req.query);

  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ message: 'Location is required' });
    }

    // Geocoding
    const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
      params: {
        q: location,
        limit: 1,
        appid: process.env.OPENWEATHERMAP_API_KEY
      }
    });

    if (geoResponse.data.length === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const { lat, lon, name, country, state } = geoResponse.data[0];

    // Current Weather
    const currentWeatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        lat,
        lon,
        appid: process.env.OPENWEATHERMAP_API_KEY,
        units: 'metric'
      }
    });

    // 5-day/3-hour Forecast
    const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
      params: {
        lat,
        lon,
        appid: process.env.OPENWEATHERMAP_API_KEY,
        units: 'metric'
      }
    });

    const weatherData = {
      location: { name, country, state },
      current: {
        temperature: currentWeatherResponse.data.main.temp,
        description: currentWeatherResponse.data.weather[0].description,
        icon: currentWeatherResponse.data.weather[0].icon,
        humidity: currentWeatherResponse.data.main.humidity,
        windSpeed: currentWeatherResponse.data.wind.speed,
        feelsLike: currentWeatherResponse.data.main.feels_like
      },
      forecast: forecastResponse.data.list.map(item => ({
        dt: item.dt,
        temp: item.main.temp,
        description: item.weather[0].description,
        icon: item.weather[0].icon
      }))
    };

    res.json(weatherData);

  } catch (error) {
    console.error('Error details:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error fetching weather data' });
  }
});

module.exports = router;
