import express from 'express';
import { body } from 'express-validator';

import feedController from '../controllers/feed.js';
import { isAuth } from '../middleware/is-auth.js';

const router = express.Router();

// GET /feed/posts
// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);

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
  ],isAuth,
  feedController.createPost
);

router.get('/post/:postId', feedController.getPost);

router.put(
  '/post/:postId',
  [
    body('product')
      .trim()
      .optional()
      .isLength({ min: 5 }),
    body('description')
      .trim()
      .optional()
      .isLength({ min: 10 }),
    body('price')
      .trim()
      .optional()
      .isLength({ min: 1 })
  ],
  feedController.updatePost
);

router.delete('/post/:postId', feedController.deletePost);

export default router;
