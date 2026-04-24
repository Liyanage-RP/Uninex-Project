const express = require('express');
const { getPosts, createPost, deletePost, likePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getPosts)
    .post(protect, createPost);

router.route('/:id')
    .delete(protect, deletePost);

router.route('/:id/like')
    .put(protect, likePost);

module.exports = router;
