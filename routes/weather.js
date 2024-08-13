/**
 * weather.js
 *
 * This file contains the route handler for weather-related API requests.
 * It uses the OpenWeatherMap API to fetch weather data based on location.
 *
 * The main functionality includes:
 * 1. Geocoding: Convert location name to coordinates
 * 2. Fetching current weather data
 * 3. Fetching 5-day forecast data
 * 4. Fetching air quality data (New addition)
 *
 * This route is protected by authentication middleware.
 */
const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const router = express.Router();

// Route to get weather data
router.get('/weatherdata', auth, async (req, res) => {
  console.log('Received weather data request for location:', req.query.location);
  const { location } = req.query;

  // Validate input
  if (!location) {
    console.log('Error: Location not provided');
    return res.status(400).json({ message: 'Location is required' });
  }

  try {
    // Step 1: Geocoding - Convert location name to coordinates
    console.log('Fetching geocoding data...');
    const geoResponse = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
      params: {
        q: location,
        limit: 1,
        appid: process.env.OPENWEATHERMAP_API_KEY
      }
    });

    // Check if location was found
    if (geoResponse.data.length === 0) {
      console.log('Error: Location not found');
      return res.status(404).json({ message: 'Location not found' });
    }

    // Extract location details
    const { lat, lon, name, country, state } = geoResponse.data[0];
    console.log(`Location found: ${name}, ${state}, ${country} (${lat}, ${lon})`);

    // Step 2, 3 & 4: Fetch current weather, 5-day forecast, and air quality
    console.log('Fetching current weather, forecast, and air quality...');
    const [currentWeatherResponse, forecastResponse, airQualityResponse] = await Promise.all([
      // Current weather API call
      axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          lat,
          lon,
          appid: process.env.OPENWEATHERMAP_API_KEY,
          units: 'metric'
        }
      }),
      // 5-day forecast API call
      axios.get('https://api.openweathermap.org/data/2.5/forecast', {
        params: {
          lat,
          lon,
          appid: process.env.OPENWEATHERMAP_API_KEY,
          units: 'metric'
        }
      }),
      // Air quality API call (New addition)
      axios.get('http://api.openweathermap.org/data/2.5/air_pollution', {
        params: {
          lat,
          lon,
          appid: process.env.OPENWEATHERMAP_API_KEY
        }
      })
    ]);

    // Process and structure the weather data
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
      })),
      // Air quality data (New addition)
      airQuality: {
        aqi: airQualityResponse.data.list[0].main.aqi,
        components: airQualityResponse.data.list[0].components
      }
    };

    console.log('Weather and air quality data fetched successfully');
    res.json(weatherData);

  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ message: 'Error fetching weather data' });
  }
});

module.exports = router;
