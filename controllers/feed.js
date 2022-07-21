const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 6;
  let totalItems;
  Post.find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(posts => {
      res
        .status(200)
        .json({
          message: 'Article récupérer avec succès.',
          posts: posts,
          totalItems: totalItems
        });
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

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Erreur, les données entrer sont incorrectes.');
    error.statusCode = 422;
    throw error;
  }
  const product = req.body.product;
  const description = req.body.description;
  const price = req.body.price;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Impossible de trouver l\'article.');
        error.statusCode = 404;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      if(product) post.product = product;
      if(imageUrl) post.imageUrl = imageUrl;
      if(description) post.description = description;
      if(price) post.price = price;
      return post.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Article mis à jour!', post: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Impossible de trouver l\'article.');
        error.statusCode = 404;
        throw error;
      }
      // Check logged in user
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'Article supprimer.' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
