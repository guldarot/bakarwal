const User = require('../models/User');
const Post = require('../models/Post');

// Get user profile by ID
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, location } = req.body;
    
    // Build update object
    const updateFields = {};
    
    if (name) updateFields.name = name;
    if (bio) updateFields.bio = bio;
    
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
    
    // Handle profile picture update
    if (req.body.profilePicture) {
      updateFields.profilePicture = req.body.profilePicture;
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Get user's posts
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

// Add pinned post
exports.addPinnedPost = async (req, res) => {
  try {
    const { postId } = req.body;
    
    // Check if post exists and belongs to user
    const post = await Post.findOne({ _id: postId, userId: req.user.userId });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found or does not belong to user'
      });
    }
    
    // Add to pinned posts (limit to 5)
    const user = await User.findById(req.user.userId);
    
    if (!user.pinnedPosts) {
      user.pinnedPosts = [];
    }
    
    // Check if already pinned
    if (user.pinnedPosts.includes(postId)) {
      return res.status(400).json({
        success: false,
        message: 'Post already pinned'
      });
    }
    
    // Limit to 5 pinned posts
    if (user.pinnedPosts.length >= 5) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 5 pinned posts allowed'
      });
    }
    
    user.pinnedPosts.push(postId);
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Post pinned successfully',
      data: {
        pinnedPosts: user.pinnedPosts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error pinning post',
      error: error.message
    });
  }
};

// Remove pinned post
exports.removePinnedPost = async (req, res) => {
  try {
    const { postId } = req.body;
    
    const user = await User.findById(req.user.userId);
    
    if (!user.pinnedPosts) {
      user.pinnedPosts = [];
    }
    
    // Remove post from pinned posts
    user.pinnedPosts = user.pinnedPosts.filter(
      id => id.toString() !== postId.toString()
    );
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Post unpinned successfully',
      data: {
        pinnedPosts: user.pinnedPosts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unpinning post',
      error: error.message
    });
  }
};

// Get pinned posts
exports.getPinnedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate({
      path: 'pinnedPosts',
      populate: [
        { path: 'userId', select: 'username name profilePicture' },
        { path: 'tags', select: 'username name' }
      ]
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        pinnedPosts: user.pinnedPosts || []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pinned posts',
      error: error.message
    });
  }
};