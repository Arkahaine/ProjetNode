const express = require('express');
const { body } = require('express-validator/check');

const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post(
  '/post',
  [
    body('product')
      .trim()
      .isLength({ min: 5 }),
    body('description')
      .trim()
      .isLength({ min: 10 }),
    body('price')
      .trim()
      .isLength({ min: 1 })
  ],
  feedController.createPost
);

router.get('/post/:postId', feedController.getPost);

module.exports = router;
