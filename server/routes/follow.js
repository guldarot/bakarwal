const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkFollowStatus
} = require('../controllers/followController');

// Follow a user (protected)
router.post('/', protect, followUser);

// Unfollow a user (protected)
router.delete('/', protect, unfollowUser);

// Get followers of a user
router.get('/followers/:userId', getFollowers);

// Get users that a user is following
router.get('/following/:userId', getFollowing);

// Check if user is following another user (protected)
router.get('/:userId', protect, checkFollowStatus);

module.exports = router;