const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    // Extract user details from request body
    const { username, email, password } = req.body;

    // Create a new user in the database
    const user = await User.create({ username, email, password });

    // Generate a JWT token for the new user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d', // Token expires in 1 day
    });

    // Send success message along with the token in the response
    res.status(201).json({ message: "Registration successful", token });

  } catch (error) {
    // Handle potential errors
    if (error.code === 11000) {
      // Duplicate key error (username or email already exists)
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({ message: `${field} already exists` });
    } else {
      // For any other error, send the error message
      res.status(400).json({ message: error.message });
    }
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    // Extract login credentials from request body
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists and password is correct
    if (!user || !(await user.correctPassword(password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d', // Token expires in 1 day
    });

    // Send success message along with the token in the response
    res.json({ message: "Login successful", token });

  } catch (error) {
    // For any error, send the error message
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
