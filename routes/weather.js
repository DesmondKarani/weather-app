const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/current', auth, async (req, res) => {
  console.log('Received weather request');
  console.log('Query params:', req.query);

  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      console.log('Missing lat or lon');
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    console.log('Fetching weather data from OpenWeatherMap');

    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        lat,
        lon,
        appid: process.env.OPENWEATHERMAP_API_KEY,
        units: 'metric'
      }
    });

    console.log('Received response from OpenWeatherMap');

    const weatherData = {
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      feelsLike: response.data.main.feels_like  // Added "feels like" temperature
    };

    res.json(weatherData);

  } catch (error) {
    console.error('Error details:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error fetching weather data' });
  }
});

// New route for 5-day forecast
router.get('/forecast', auth, async (req, res) => {
  console.log('Received forecast request');
  console.log('Query params:', req.query);

  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      console.log('Missing lat or lon');
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    console.log('Fetching forecast data from OpenWeatherMap');

    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
      params: {
        lat,
        lon,
        appid: process.env.OPENWEATHERMAP_API_KEY,
        units: 'metric'
      }
    });

    console.log('Received forecast response from OpenWeatherMap');

    // Process and send the forecast data
    const forecastData = response.data.list.map(item => ({
      dt: item.dt,
      temp: item.main.temp,
      description: item.weather[0].description,
      icon: item.weather[0].icon
    }));

    res.json(forecastData);

  } catch (error) {
    console.error('Error details:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error fetching forecast data' });
  }
});

module.exports = router;
