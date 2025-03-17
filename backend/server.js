require('dotenv').config(); // Add this line at the top
const express = require('express');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const ratingRoutes = require('./routes/rating');
const suggestionRoutes = require('./routes/suggestions');
const cors = require('cors'); // Add this line

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/suggestions', suggestionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
