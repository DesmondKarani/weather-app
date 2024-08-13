# Wingu Weather App - Frontend

This directory contains the frontend React application for the Wingu Weather App.

## Quick Start

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start`: Runs the app in development mode.
- `npm test`: Launches the test runner.
- `npm run build`: Builds the app for production to the `build` folder.

## Frontend Structure

- `src/components/`: Contains React components (LandingPage, Register, Weather).
- `src/App.js`: Main component that sets up routing.
- `src/index.js`: Entry point of the React app.

## Environment Variables

Create a `.env` file in this directory with the following:

```
REACT_APP_API_URL=http://localhost:5000
```

For production, use `.env.production` with your production API URL.

## Building for Production

Run `npm run build` to create a production-ready build. The built files will be in the `build` directory.

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).
