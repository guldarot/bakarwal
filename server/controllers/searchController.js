const User = require('../models/User');
const Post = require('../models/Post');

// Search users
exports.searchUsers = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    // Create search conditions
    const searchConditions = [
      { username: { $regex: query, $options: 'i' } },
      { name: { $regex: query, $options: 'i' } },
      { bio: { $regex: query, $options: 'i' } }
    ];
    
    // Search users
    const users = await User.find({
      $or: searchConditions
    })
    .select('username name profilePicture bio followersCount followingCount postsCount')
    .skip(skip)
    .limit(parseInt(limit));
    
    const totalUsers = await User.countDocuments({
      $or: searchConditions
    });
    
    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / parseInt(limit)),
          totalUsers
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching users',
      error: error.message
    });
  }
};

// Search posts
exports.searchPosts = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    // Create search conditions
    const searchConditions = [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ];
    
    // Search posts
    const posts = await Post.find({
      $or: searchConditions
    })
    .populate('userId', 'username name profilePicture')
    .populate('tags', 'username name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
    const totalPosts = await Post.countDocuments({
      $or: searchConditions
    });
    
    res.status(200).json({
      success: true,
      data: {
        posts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalPosts / parseInt(limit)),
          totalPosts
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching posts',
      error: error.message
    });
  }
};

// Search everything (users and posts)
exports.searchAll = async (req, res) => {
  try {
    const { query, page = 1, limit = 5 } = req.query; // Limit to 5 each
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    // Search users
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } }
      ]
    })
    .select('username name profilePicture bio followersCount followingCount postsCount')
    .skip(skip)
    .limit(parseInt(limit));
    
    // Search posts
    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    })
    .populate('userId', 'username name profilePicture')
    .populate('tags', 'username name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
    const totalUsers = await User.countDocuments({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } }
      ]
    });
    
    const totalPosts = await Post.countDocuments({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });
    
    res.status(200).json({
      success: true,
      data: {
        users,
        posts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.max(
            Math.ceil(totalUsers / parseInt(limit)),
            Math.ceil(totalPosts / parseInt(limit))
          ),
          totalUsers,
          totalPosts
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching',
      error: error.message
    });
  }
};

// Get popular users (sorted by followers count)
exports.getPopularUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await User.find()
      .select('username name profilePicture bio followersCount followingCount postsCount')
      .sort({ followersCount: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalUsers = await User.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / parseInt(limit)),
          totalUsers
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching popular users',
      error: error.message
    });
  }
};

// Get trending posts (sorted by comments count)
exports.getTrendingPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const posts = await Post.find()
      .populate('userId', 'username name profilePicture')
      .populate('tags', 'username name')
      .sort({ commentsCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalPosts = await Post.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        posts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalPosts / parseInt(limit)),
          totalPosts
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trending posts',
      error: error.message
    });
  }
};