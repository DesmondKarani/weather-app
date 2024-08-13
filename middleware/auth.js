/**
 * auth.js
 *
 * This file contains the authentication middleware for protecting routes.
 * It verifies the JWT token provided in the request header and attaches
 * the authenticated user to the request object.
 *
 * The middleware performs the following steps:
 * 1. Extract the token from the Authorization header
 * 2. Verify the token using the JWT_SECRET
 * 3. Find the user in the database using the decoded user ID
 * 4. Attach the user to the request object if found
 *
 * If any step fails, it returns a 401 Unauthorized response.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    console.log('Authenticating request...');

    // Extract the token from the Authorization header
    // The header should be in the format: "Bearer <token>"
    const token = req.header('Authorization').replace('Bearer ', '');

    // Verify the token using the JWT_SECRET from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database using the decoded user ID
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log('Authentication failed: User not found');
      throw new Error('User not found');
    }

    console.log('Authentication successful for user:', user.username);

    // Attach the authenticated user to the request object
    // This makes the user available in subsequent middleware or route handlers
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log('Authentication failed:', error.message);

    // If any error occurs during authentication, return a 401 Unauthorized response
    res.status(401).json({ message: 'Please authenticate' });
  }
};
