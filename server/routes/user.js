const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getUserProfile,
  updateProfile,
  getUserPosts,
  addPinnedPost,
  removePinnedPost,
  getPinnedPosts
} = require('../controllers/userController');

// Get user profile by ID
router.get('/:userId', getUserProfile);

// Update profile (protected)
router.put('/profile', protect, updateProfile);

// Get user's posts
router.get('/:userId/posts', getUserPosts);

// Add pinned post (protected)
router.post('/pinned', protect, addPinnedPost);

// Remove pinned post (protected)
router.delete('/pinned', protect, removePinnedPost);

// Get pinned posts
router.get('/:userId/pinned', getPinnedPosts);

module.exports = router;