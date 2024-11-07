const express = require('express');
const router = express.Router();
const Comment = require('../models/blogCommentModel');
const Reply = require('../models/blogReplyModel');

// Get comments for a specific blog post
router.get('/comments/:blogId', async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.blogId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new comment
router.post('/comments', async (req, res) => {
  const { blogId, content, createdAt } = req.body;
  const newComment = new Comment({ blogId, content, createdAt });

  try {
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a comment
router.delete('/comments/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await comment.remove();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get replies for a specific comment
router.get('/replies/:commentId', async (req, res) => {
  try {
    const replies = await Reply.find({ commentId: req.params.commentId }).sort({ createdAt: -1 });
    res.json(replies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new reply
router.post('/replies', async (req, res) => {
  const { blogId, commentId, content, createdAt } = req.body;
  const newReply = new Reply({ blogId, commentId, content, createdAt });

  try {
    await newReply.save();
    res.status(201).json(newReply);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a reply
router.delete('/replies/:id', async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.id);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    await reply.remove();
    res.json({ message: 'Reply deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;