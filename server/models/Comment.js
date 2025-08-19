const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    default: ''
  },
  voiceNote: {
    url: {
      type: String,
      default: ''
    },
    publicId: {
      type: String,
      default: ''
    },
    duration: {
      type: Number, // in seconds
      default: 0
    }
  },
  isVoiceNote: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);