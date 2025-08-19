const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  searchUsers,
  searchPosts,
  searchAll,
  getPopularUsers,
  getTrendingPosts
} = require('../controllers/searchController');

// Search users
router.get('/users', searchUsers);

// Search posts
router.get('/posts', searchPosts);

// Search everything
router.get('/all', searchAll);

// Get popular users
router.get('/popular', getPopularUsers);

// Get trending posts
router.get('/trending', getTrendingPosts);

module.exports = router;