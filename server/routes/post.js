const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getUserPosts,
  addTag,
  removeTag
} = require('../controllers/postController');

// Create post (protected)
router.post('/', protect, createPost);

// Get all posts
router.get('/', getPosts);

// Get post by ID
router.get('/:postId', getPostById);

// Update post (protected)
router.put('/:postId', protect, updatePost);

// Delete post (protected)
router.delete('/:postId', protect, deletePost);

// Get user posts
router.get('/user/:userId', getUserPosts);

// Add tag to post (protected)
router.post('/:postId/tags', protect, addTag);

// Remove tag from post (protected)
router.delete('/:postId/tags', protect, removeTag);

module.exports = router;