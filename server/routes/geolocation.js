const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getNearbyUsers,
  getNearbyPosts,
  getSuggestedPosts,
  updateLocation
} = require('../controllers/geolocationController');

// Get nearby users
router.get('/users', protect, getNearbyUsers);

// Get nearby posts
router.get('/posts', protect, getNearbyPosts);

// Get suggested posts
router.get('/suggested', protect, getSuggestedPosts);

// Update user location
router.put('/location', protect, updateLocation);

module.exports = router;