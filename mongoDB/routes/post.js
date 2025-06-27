const express = require('express');
const Post = require('../models/post');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

// Create post
router.post('/', auth(), async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = new Post({ title, content, user: req.user.userId });
    await post.save();
    // Add post to user's posts array
    await User.findByIdAndUpdate(req.user.userId, { $push: { posts: post._id } });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all posts for user
router.get('/', auth(), async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.userId });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update post
router.put('/:id', auth(), async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post
router.delete('/:id', auth(), async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    // Remove post from user's posts array
    await User.findByIdAndUpdate(req.user.userId, { $pull: { posts: post._id } });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 