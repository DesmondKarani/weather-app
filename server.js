const express = require('express');
const authRoutes = require('./routes/auth');
const weatherRoutes = require('./routes/weather');
const errorHandler = require('./middleware/errorHandler');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes (we'll add these later)
// app.use('/api/weather', require('./routes/weather'));
// app.use('/api/users', require('./routes/users'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
