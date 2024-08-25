const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.post('/', async (req, res) => {
  try {
    const { content } = req.body;
    const post = new Post({ content, createdBy: req.user._id });
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('createdBy', 'username');
    res.json(posts);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
