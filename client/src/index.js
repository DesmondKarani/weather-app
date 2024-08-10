/**
 * index.js
 * 
 * This is the entry point for the React application.
 * It renders the main App component and sets up performance measurement.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

// Create a root for the React application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component wrapped in StrictMode for additional checks and warnings
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
