/**
 * Navbar.js
 * 
 * This component renders the navigation bar for the application.
 * It uses NavLink for automatic active class application.
 * 
 * Note: This version reflects the following changes:
 * - Removed the Home link (assuming LandingPage serves as the home page)
 * - Removed the Login link (assuming login is handled on the LandingPage)
 * - Kept the Weather link (which should only be accessible when logged in)
 * - Kept the Register link for new user registration
 */

import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        {/* NavLink automatically applies an 'active' class when the current route matches */}
        <li><NavLink to="/">Weather-Now</NavLink></li>
        <li><NavLink to="/register">Register</NavLink></li>
        <li><NavLink to="/weather">Weather</NavLink></li>
      </ul>
    </nav>
  );
}

export default Navbar;
