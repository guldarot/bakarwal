const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Animal Raiser Connect API' });
});

// Auth routes
app.use('/api/auth', require('./routes/auth'));

// User routes
app.use('/api/users', require('./routes/user'));

// Post routes
app.use('/api/posts', require('./routes/post'));

// Follow routes
app.use('/api/follow', require('./routes/follow'));

// Geolocation routes
app.use('/api/geolocation', require('./routes/geolocation'));

// Comment routes
app.use('/api/comments', require('./routes/comment'));

// Search routes
app.use('/api/search', require('./routes/search'));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});