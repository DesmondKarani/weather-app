/**
 * server.js
 *
 * This file sets up and configures the Express server for the Weather App.
 * It handles middleware setup, database connection, routing, and server initialization.
 */

const express = require('express');
const authRoutes = require('./routes/auth');
const weatherRoutes = require('./routes/weather');
const errorHandler = require('./middleware/errorHandler');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200
};

// Middleware setup
app.use(cors(corsOptions)); // Use CORS with options
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start the server and listen on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
