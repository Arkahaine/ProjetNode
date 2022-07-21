const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: '1',
        price: '800$',
        product: 'RTX 3080',
        content: 'TEST123',
        imageUrl: 'images/produit.jpg',
      }
    ]
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, entered data is incorrect.',
      errors: errors.array()
    });
  }

  const post = new Post({
    content: req.body.content,
    product: req.body.product,
    price: req.body.price,
    imageUrl: 'images/produit.jpg',
  });
  post
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Post créer avec succès',
        post: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};