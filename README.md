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
├── client
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   └── src
│       ├── components
│       │   ├── LandingPage.js
│       │   ├── LandingPage.css
│       │   ├── Register.js
│       │   ├── Register.css
│       │   ├── Weather.js
│       │   ├── Weather.css
│       │   └── weather-background.jpg
│       ├── App.js
│       ├── App.css
│       ├── index.js
│       ├── index.css
│       ├── logo.svg
│       ├── reportWebVitals.js
│       └── setupTests.js
├── middleware
│   ├── auth.js
│   └── errorHandler.js
├── models
│   └── User.js
├── routes
│   ├── auth.js
│   └── weather.js
├── .env
├── .gitignore
├── LICENSE
├── README.md
├── package.json
├── package-lock.json
└── server.js

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
