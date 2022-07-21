const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      res
        .status(200)
        .json({ message: 'Articles récupérer avec succès.', posts: posts });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Erreur, les données entrer sont incorrectes.');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('Aucune image fournit.');
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path;
  const product = req.body.product;
  const description = req.body.description;
  const price = req.body.price;

  const post = new Post({
    product: product,
    description: description,
    imageUrl: imageUrl,
    price: price,
  });
  post
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Article créer avec succès!',
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

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Impossible de trouver l\'article.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Article récupérer.', post: post });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
