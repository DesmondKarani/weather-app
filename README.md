# Weather App

This is a full-stack weather application built using the MERN stack (MongoDB, Express, React, Node.js). It allows users to register, login, and fetch current weather data, air quality information, and a 5-day forecast based on location.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Technologies Used](#technologies-used)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [Contact](#contact)
- [License](#license)

## Features

- **User Authentication:** Secure sign-up and login functionality using JWT.
- **Weather Data:** Fetch and display current weather information, including temperature, humidity, and wind speed.
- **Air Quality:** Show air quality index (AQI) and pollutant levels.
- **5-Day Forecast:** Display a 5-day weather forecast.
- **Responsive UI:** Frontend built with React to provide a smooth user experience across devices.
- **Dark Mode:** Toggle between light and dark themes for comfortable viewing.

## Project Structure

```
weather-app/
├── .env                   # Environment variables for the server
├── .gitignore             # Files and directories to ignore in git
├── LICENSE                # Project license
├── README.md              # Project documentation (this file)
├── client/                # Frontend of the application
│   ├── .env               # Environment variables for the client
│   ├── .env.production    # Environment variables for production
│   ├── .gitignore         # Files and directories to ignore in the client
│   ├── README.md          # Client-side documentation
│   ├── package-lock.json  # Dependency tree lock file for client
│   ├── package.json       # Client-side dependencies and scripts
│   ├── public/            # Public assets for the client
│   │   ├── index.html     # HTML template for the client
│   │   ├── manifest.json  # Web app manifest file
│   │   ├── robots.txt     # Robots exclusion file
│   │   └── thunder.svg    # SVG image used in the application
│   └── src/               # Source files for the client
│       ├── App.js         # Main React component
│       ├── components/
│       │   ├── LandingPage.css      # Styles for the landing page
│       │   ├── LandingPage.js       # Landing page component
│       │   ├── Register.css         # Styles for the registration page
│       │   ├── Register.js          # Registration component
│       │   ├── Weather.css          # Styles for the weather component
│       │   ├── Weather.js           # Weather display component
│       │   └── weather-background.jpg  # Background image for weather display
│       ├── index.css      # Global styles
│       ├── index.js       # Entry point for the React app
│       └── reportWebVitals.js  # Performance reporting for the app
├── middleware/            # Server middleware
│   ├── auth.js            # Authentication middleware
│   └── errorHandler.js    # Error handling middleware
├── models/                # Data models for the application
│   └── User.js            # User model for authentication and authorization
├── package-lock.json      # Dependency tree lock file for the server
├── package.json           # Server-side dependencies and scripts
├── routes/                # API routes
│   ├── auth.js            # Authentication routes
│   └── weather.js         # Weather data routes
└── server.js              # Entry point for the server

7 directories, 33 files
```

## Prerequisites

Ensure you have the following installed:
- Node.js (v14 or later)
- npm (Node Package Manager)
- MongoDB

## Installation

1. Clone the repository:
    ```
    git clone https://github.com/yourusername/weather-app.git
    cd weather-app
    ```

2. Install server dependencies:
    ```
    npm install
    ```

3. Install client dependencies:
    ```
    cd client
    npm install
    ```

## Environment Variables

Create a `.env` file in the root directory and a `.env.production` file in the `client` directory. Below are the required environment variables:

### Root `.env` (Backend)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
```

### Client `.env.production` (Frontend)
```
REACT_APP_API_URL=https://your-production-api-url.com
REACT_APP_OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
```

## Running the Application

1. Start the backend server:
   ```
   npm start
   ```

2. In a new terminal, start the frontend development server:
   ```
   cd client
   npm start
   ```

3. Access the application at `http://localhost:3000`

## Technologies Used

- **Backend:** Node.js, Express, MongoDB
- **Frontend:** React, Axios
- **Authentication:** JSON Web Tokens (JWT)
- **API Integration:** OpenWeatherMap API
- **Styling:** CSS

## Authentication

This application uses JWT for authentication. The token is automatically included in the Authorization header for protected routes when using the frontend.

## Contributing

This project is currently maintained by Desmond Karani. Contributions, issues, and feature requests are welcome!

## Contact

Connect with me on social media:

- **X (formerly Twitter):** [@karanides](https://x.com/karani_des)
- **LinkedIn:** [Desmond Karani](https://www.linkedin.com/in/desmond-karani-a78359b2/)
- **GitHub:** [Desmond Karani](https://github.com/DesmondKarani)
- **Instagram:** [@karani_desmond](https://www.instagram.com/karani_desmond/)

## License

This project is proprietary software and cannot be used, modified, or distributed without explicit permission from the author, Desmond Karani. All rights reserved.

See [License](./LICENSE).
