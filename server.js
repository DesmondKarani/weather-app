/**
 * server.js
 *
 * This file sets up and configures the Express server for the Weather App.
 * It handles middleware setup, database connection, routing, and server initialization.
 */

const express = require('express'); // Import the Express framework
const authRoutes = require('./routes/auth'); // Import authentication routes
const weatherRoutes = require('./routes/weather'); // Import weather-related routes
const errorHandler = require('./middleware/errorHandler'); // Import custom error handling middleware
const mongoose = require('mongoose'); // Import Mongoose for MongoDB interaction
require('dotenv').config(); // Load environment variables from a .env file

// Initialize Express app
const app = express(); 
const PORT = process.env.PORT || 5000; // Use port from environment or default to 5000

// Middleware setup
app.use(express.json()); // Parse incoming JSON request bodies
app.use('/api/auth', authRoutes); // Handle requests to /api/auth using auth routes
app.use('/api/weather', weatherRoutes); // Handle requests to /api/weather using weather routes
app.use(errorHandler); // Handle errors globally with custom middleware

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true, // Use new URL string parser (MongoDB)
  useUnifiedTopology: true, // Use the new server discovery and monitoring engine
})
.then(() => console.log('MongoDB connected')) // Log success if connected
.catch(err => console.error('MongoDB connection error:', err)); // Log error if connection fails

// Note: These routes are for future implementation
// app.use('/api/weather', require('./routes/weather')); // Weather route handler placeholder
// app.use('/api/users', require('./routes/users')); // User route handler placeholder

// Start the server and listen on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
