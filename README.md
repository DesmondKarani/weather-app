# Weather App

This is a full-stack weather application built using the MERN stack (MongoDB, Express, React, Node.js). It allows users to register, login, and fetch current weather data based on location.

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Technologies Used](#technologies-used)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [Contact](#contact)
- [Licence](#license)

## Project Structure

```
weather-app/
├── client
│   ├── build
│   ├── public
│   └── src
│       ├── components
│       ├── App.js
│       └── index.js
├── middleware
├── models
├── routes
└── server.js
```
## Features

- **User Authentication:** Secure sign-up and login functionality using JWT.
- **Weather Data:** Fetch and display weather information from an external API.
- **Responsive UI:** Frontend built with React to provide a smooth user experience across devices.

## Prerequisites

Ensure you have the following installed:

- Node.js
- npm (Node Package Manager)
- MongoDB

## Installation

1. Clone the repository:
    ```
    git clone https://github.com/yourusername/weather-app.git
    ```

2. Install server dependencies:
    ```
    cd weather-app
    npm install
    ```

3. Install client dependencies:
    ```
    cd client
    npm install
    ```

## Environment Variables

Create a `.env` file in both the root directory and the `client` directory. Below are the required environment variables:

### Root `.env` (Backend)
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
WEATHER_API_KEY=your_weather_api_key
```

### Client `.env` (Frontend)
```
REACT_APP_WEATHER_API_KEY=your_weather_api_key
```

## Running the Application

1. **Backend:**
   ```
   node server
   ```

2. **Frontend:**
   Open a new terminal window and run:
   ```
   cd client
   npm run build
   npm start
   ```

## Technologies Used

- **Backend:** Node.js, Express, MongoDB
- **Frontend:** React
- **Authentication:** JWT
- **API Integration:** Weather API

## Authentication

This application uses JWT for authentication. Include the token in the Authorization header for protected routes:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

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
