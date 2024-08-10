/**
 * App.js
 * 
 * This is the main component of the React application.
 * It sets up the routing structure for the Weather App.
 */

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Register from './components/Register';
import Weather from './components/Weather';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Define the application routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/weather" element={<Weather />} />
          {/* Redirect any undefined routes to the home page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
