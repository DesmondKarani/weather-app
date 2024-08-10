import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        {/* NavLink automatically applies an 'active' class when the current route matches */}
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/register">Register</NavLink></li>
        <li><NavLink to="/login">Login</NavLink></li>
        <li><NavLink to="/weather">Weather</NavLink></li>
      </ul>
    </nav>
  );
}

export default Navbar;
