const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  addComment,
  getComments,
  updateComment,
  deleteComment,
  getCommentById
} = require('../controllers/commentController');

// Add comment to post (protected)
router.post('/:postId', protect, addComment);

// Get comments for a post
router.get('/:postId', getComments);

// Get comment by ID
router.get('/comment/:commentId', getCommentById);

// Update comment (protected)
router.put('/:commentId', protect, updateComment);

// Delete comment (protected)
router.delete('/:commentId', protect, deleteComment);

module.exports = router;