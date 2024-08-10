const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/current', auth, async (req, res) => {
  console.log('Received weather request'); // Log when a request is received
  console.log('Query params:', req.query); // Log the query parameters

  try {
    const { lat, lon } = req.query;
    
    // Check if latitude and longitude are provided
    if (!lat || !lon) {
      console.log('Missing lat or lon'); // Log if lat or lon is missing
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    console.log('Fetching weather data from OpenWeatherMap'); // Log before making API call

    // Make API call to OpenWeatherMap
    // Note: Changed to use the free Current Weather Data API (2.5)
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        lat,
        lon,
        appid: process.env.OPENWEATHERMAP_API_KEY,
        units: 'metric'
      }
    });

    console.log('Received response from OpenWeatherMap'); // Log after receiving API response

    // Parse the weather data from the API response
    const weatherData = {
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed
    };

    // Send the parsed weather data as the response
    res.json(weatherData);

  } catch (error) {
    // Log detailed error information
    console.error('Error details:', error.response ? error.response.data : error.message);
    
    // Send a generic error message to the client
    res.status(500).json({ message: 'Error fetching weather data' });
  }
});

module.exports = router;
