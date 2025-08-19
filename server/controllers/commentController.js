const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Add comment to post
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text, voiceNote } = req.body;
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Validate comment content
    if (!text && !voiceNote) {
      return res.status(400).json({
        success: false,
        message: 'Comment must have text or voice note'
      });
    }
    
    // Build comment object
    const commentFields = {
      postId,
      userId: req.user.userId,
      isVoiceNote: false
    };
    
    if (text) {
      commentFields.text = text;
    }
    
    if (voiceNote) {
      commentFields.voiceNote = {
        url: voiceNote.url,
        publicId: voiceNote.publicId,
        duration: voiceNote.duration || 0
      };
      commentFields.isVoiceNote = true;
    }
    
    // Create comment
    const comment = new Comment(commentFields);
    await comment.save();
    
    // Populate user info
    await comment.populate('userId', 'username name profilePicture');
    
    // Update post's comment count
    post.commentsCount += 1;
    await post.save();
    
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: {
        comment
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
};

// Get comments for a post
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Get comments
    const comments = await Comment.find({ postId })
      .populate('userId', 'username name profilePicture')
      .sort({ createdAt: 1 }) // Oldest first
      .skip(skip)
      .limit(limit);
    
    const totalComments = await Comment.countDocuments({ postId });
    
    res.status(200).json({
      success: true,
      data: {
        comments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalComments / limit),
          totalComments
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message
    });
  }
};

// Update comment
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text, voiceNote } = req.body;
    
    // Check if comment exists and belongs to user
    const comment = await Comment.findOne({
      _id: commentId,
      userId: req.user.userId
    });
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found or does not belong to user'
      });
    }
    
    // Validate comment content
    if (!text && !voiceNote) {
      return res.status(400).json({
        success: false,
        message: 'Comment must have text or voice note'
      });
    }
    
    // Build update object
    const updateFields = {};
    
    if (text) {
      updateFields.text = text;
      updateFields.isVoiceNote = false;
      
      // Remove voice note if it exists
      if (comment.voiceNote) {
        updateFields.voiceNote = undefined;
      }
    }
    
    if (voiceNote) {
      updateFields.voiceNote = {
        url: voiceNote.url,
        publicId: voiceNote.publicId,
        duration: voiceNote.duration || 0
      };
      updateFields.isVoiceNote = true;
      
      // Remove text if it exists
      if (comment.text) {
        updateFields.text = undefined;
      }
    }
    
    // Update comment
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $set: updateFields },
      { new: true }
    ).populate('userId', 'username name profilePicture');
    
    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: {
        comment: updatedComment
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating comment',
      error: error.message
    });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    // Check if comment exists and belongs to user or if user is post owner
    const comment = await Comment.findById(commentId).populate('postId');
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Check if user is comment owner or post owner
    const isCommentOwner = comment.userId.toString() === req.user.userId;
    const isPostOwner = comment.postId.userId.toString() === req.user.userId;
    
    if (!isCommentOwner && !isPostOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }
    
    // Delete comment
    await Comment.findByIdAndDelete(commentId);
    
    // Update post's comment count
    const post = await Post.findById(comment.postId);
    if (post) {
      post.commentsCount = Math.max(0, post.commentsCount - 1);
      await post.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: error.message
    });
  }
};

// Get comment by ID
exports.getCommentById = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    const comment = await Comment.findById(commentId)
      .populate('userId', 'username name profilePicture')
      .populate('postId', 'title');
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        comment
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching comment',
      error: error.message
    });
  }
};