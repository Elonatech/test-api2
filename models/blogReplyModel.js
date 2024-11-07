const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  blogId: {
    type: String,
    required: true
  },
  commentId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reply', replySchema);