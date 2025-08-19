const Follow = require('../models/Follow');
const User = require('../models/User');

// Follow a user
exports.followUser = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Check if user is trying to follow themselves
    if (req.user.userId === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }
    
    // Check if user exists
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if already following
    const existingFollow = await Follow.findOne({
      follower: req.user.userId,
      following: userId
    });
    
    if (existingFollow) {
      return res.status(400).json({
        success: false,
        message: 'You are already following this user'
      });
    }
    
    // Create follow relationship
    const follow = new Follow({
      follower: req.user.userId,
      following: userId
    });
    
    await follow.save();
    
    // Update follower counts
    await User.findByIdAndUpdate(userId, {
      $inc: { followersCount: 1 }
    });
    
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { followingCount: 1 }
    });
    
    res.status(200).json({
      success: true,
      message: 'User followed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error following user',
      error: error.message
    });
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Check if user exists
    const userToUnfollow = await User.findById(userId);
    if (!userToUnfollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if following
    const follow = await Follow.findOneAndDelete({
      follower: req.user.userId,
      following: userId
    });
    
    if (!follow) {
      return res.status(400).json({
        success: false,
        message: 'You are not following this user'
      });
    }
    
    // Update follower counts
    await User.findByIdAndUpdate(userId, {
      $inc: { followersCount: -1 }
    });
    
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { followingCount: -1 }
    });
    
    res.status(200).json({
      success: true,
      message: 'User unfollowed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unfollowing user',
      error: error.message
    });
  }
};

// Get followers of a user
exports.getFollowers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get followers
    const follows = await Follow.find({ following: req.params.userId })
      .populate('follower', 'username name profilePicture followersCount followingCount')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const totalFollowers = await Follow.countDocuments({ following: req.params.userId });
    
    const followers = follows.map(follow => follow.follower);
    
    res.status(200).json({
      success: true,
      data: {
        followers,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalFollowers / limit),
          totalFollowers
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching followers',
      error: error.message
    });
  }
};

// Get users that a user is following
exports.getFollowing = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get following
    const follows = await Follow.find({ follower: req.params.userId })
      .populate('following', 'username name profilePicture followersCount followingCount')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const totalFollowing = await Follow.countDocuments({ follower: req.params.userId });
    
    const following = follows.map(follow => follow.following);
    
    res.status(200).json({
      success: true,
      data: {
        following,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalFollowing / limit),
          totalFollowing
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching following',
      error: error.message
    });
  }
};

// Check if user is following another user
exports.checkFollowStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if following
    const follow = await Follow.findOne({
      follower: req.user.userId,
      following: userId
    });
    
    res.status(200).json({
      success: true,
      data: {
        isFollowing: !!follow
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking follow status',
      error: error.message
    });
  }
};