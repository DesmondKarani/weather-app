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
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use('/api/auth', authRoutes); // Mount authentication routes
app.use('/api/weather', weatherRoutes); // Mount weather routes
app.use(errorHandler); // Global error handling middleware

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Note: These routes are for future implementation
// app.use('/api/weather', require('./routes/weather'));
// app.use('/api/users', require('./routes/users'));

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
