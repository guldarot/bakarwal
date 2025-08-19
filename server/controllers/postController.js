const Post = require('../models/Post');
const User = require('../models/User');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, description, location } = req.body;
    const images = req.body.images || [];
    
    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }
    
    // Build post object
    const postFields = {
      userId: req.user.userId,
      title,
      description,
      images
    };
    
    // Handle location
    if (location && location.coordinates && location.coordinates.length === 2) {
      postFields.location = {
        type: 'Point',
        coordinates: location.coordinates
      };
      
      if (location.address) {
        postFields.location.address = location.address;
      }
    }
    
    // Create post
    const post = new Post(postFields);
    await post.save();
    
    // Populate user info
    await post.populate('userId', 'username name profilePicture');
    
    // Update user's post count
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { postsCount: 1 }
    });
    
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: {
        post
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
};

// Get all posts with pagination
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get posts with user and tag info
    const posts = await Post.find()
      .populate('userId', 'username name profilePicture')
      .populate('tags', 'username name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalPosts = await Post.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        posts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalPosts / limit),
          totalPosts
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
};

// Get post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('userId', 'username name profilePicture')
      .populate('tags', 'username name');
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        post
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message
    });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const { title, description, images, location, isSolved } = req.body;
    
    // Check if post exists and belongs to user
    const post = await Post.findOne({
      _id: req.params.postId,
      userId: req.user.userId
    });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found or does not belong to user'
      });
    }
    
    // Build update object
    const updateFields = {};
    
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (images) updateFields.images = images;
    if (isSolved !== undefined) updateFields.isSolved = isSolved;
    
    // Handle location update
    if (location && location.coordinates && location.coordinates.length === 2) {
      updateFields.location = {
        type: 'Point',
        coordinates: location.coordinates
      };
      
      if (location.address) {
        updateFields.location.address = location.address;
      }
    }
    
    // Update post
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      { $set: updateFields },
      { new: true }
    ).populate('userId', 'username name profilePicture')
      .populate('tags', 'username name');
    
    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: {
        post: updatedPost
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating post',
      error: error.message
    });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    // Check if post exists and belongs to user
    const post = await Post.findOne({
      _id: req.params.postId,
      userId: req.user.userId
    });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found or does not belong to user'
      });
    }
    
    // Delete post
    await Post.findByIdAndDelete(req.params.postId);
    
    // Update user's post count
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { postsCount: -1 }
    });
    
    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
};

// Get posts by user
exports.getUserPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const posts = await Post.find({ userId: req.params.userId })
      .populate('userId', 'username name profilePicture')
      .populate('tags', 'username name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalPosts = await Post.countDocuments({ userId: req.params.userId });
    
    res.status(200).json({
      success: true,
      data: {
        posts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalPosts / limit),
          totalPosts
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user posts',
      error: error.message
    });
  }
};

// Add tag to post
exports.addTag = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Check if post exists
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check if user exists
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Add tag if not already tagged
    if (!post.tags.includes(userId)) {
      post.tags.push(userId);
      await post.save();
    }
    
    // Populate tags
    await post.populate('tags', 'username name');
    
    res.status(200).json({
      success: true,
      message: 'User tagged successfully',
      data: {
        tags: post.tags
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error tagging user',
      error: error.message
    });
  }
};

// Remove tag from post
exports.removeTag = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Check if post exists
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Remove tag
    post.tags = post.tags.filter(
      tagId => tagId.toString() !== userId.toString()
    );
    
    await post.save();
    
    // Populate tags
    await post.populate('tags', 'username name');
    
    res.status(200).json({
      success: true,
      message: 'User tag removed successfully',
      data: {
        tags: post.tags
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing tag',
      error: error.message
    });
  }
};