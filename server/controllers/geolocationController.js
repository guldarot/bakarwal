const User = require('../models/User');
const Post = require('../models/Post');
const Follow = require('../models/Follow');

// Get nearby users based on location
exports.getNearbyUsers = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query; // maxDistance in meters
    
    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Longitude and latitude are required'
      });
    }
    
    // Convert to numbers
    const lon = parseFloat(longitude);
    const lat = parseFloat(latitude);
    const maxDist = parseInt(maxDistance);
    
    // Validate coordinates
    if (isNaN(lon) || isNaN(lat)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates'
      });
    }
    
    // Find nearby users
    const nearbyUsers = await User.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lon, lat]
          },
          $maxDistance: maxDist
        }
      },
      _id: { $ne: req.user.userId } // Exclude current user
    })
    .select('username name profilePicture location followersCount followingCount')
    .limit(20);
    
    res.status(200).json({
      success: true,
      data: {
        users: nearbyUsers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby users',
      error: error.message
    });
  }
};

// Get nearby posts based on location
exports.getNearbyPosts = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query; // maxDistance in meters
    
    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Longitude and latitude are required'
      });
    }
    
    // Convert to numbers
    const lon = parseFloat(longitude);
    const lat = parseFloat(latitude);
    const maxDist = parseInt(maxDistance);
    
    // Validate coordinates
    if (isNaN(lon) || isNaN(lat)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates'
      });
    }
    
    // Find nearby posts
    const nearbyPosts = await Post.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lon, lat]
          },
          $maxDistance: maxDist
        }
      }
    })
    .populate('userId', 'username name profilePicture')
    .populate('tags', 'username name')
    .sort({ createdAt: -1 })
    .limit(20);
    
    res.status(200).json({
      success: true,
      data: {
        posts: nearbyPosts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby posts',
      error: error.message
    });
  }
};

// Get suggested posts (nearby + followed users' posts)
exports.getSuggestedPosts = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get followed users
    const following = await Follow.find({ follower: req.user.userId })
      .select('following');
    
    const followingIds = following.map(f => f.following);
    
    // Build query conditions
    const queryConditions = [
      { userId: { $in: followingIds } } // Posts from followed users
    ];
    
    // If location is provided, add nearby posts condition
    if (longitude && latitude) {
      const lon = parseFloat(longitude);
      const lat = parseFloat(latitude);
      const maxDist = parseInt(maxDistance);
      
      if (!isNaN(lon) && !isNaN(lat)) {
        queryConditions.push({
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [lon, lat]
              },
              $maxDistance: maxDist
            }
          }
        });
      }
    }
    
    // Get posts matching either condition
    const posts = await Post.find({
      $or: queryConditions
    })
    .populate('userId', 'username name profilePicture')
    .populate('tags', 'username name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
    const totalPosts = await Post.countDocuments({
      $or: queryConditions
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
      message: 'Error fetching suggested posts',
      error: error.message
    });
  }
};

// Update user location
exports.updateLocation = async (req, res) => {
  try {
    const { longitude, latitude, address } = req.body;
    
    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Longitude and latitude are required'
      });
    }
    
    // Convert to numbers
    const lon = parseFloat(longitude);
    const lat = parseFloat(latitude);
    
    // Validate coordinates
    if (isNaN(lon) || isNaN(lat)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates'
      });
    }
    
    // Update user location
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        $set: {
          location: {
            type: 'Point',
            coordinates: [lon, lat],
            address: address || ''
          }
        }
      },
      { new: true }
    ).select('location');
    
    res.status(200).json({
      success: true,
      message: 'Location updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating location',
      error: error.message
    });
  }
};