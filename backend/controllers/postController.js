const Post = require('../models/Post');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'name').sort('-createdAt').limit(100); // Added limit for performance
        res.status(200).json({ success: true, count: posts.length, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error reading posts' });
    }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
    try {
        if (!req.body.content || typeof req.body.content !== 'string' || !req.body.content.trim()) {
            return res.status(400).json({ success: false, message: 'Please add valid text content' });
        }

        const post = await Post.create({
            content: req.body.content.trim().substring(0, 1000), // Enforce maxlength
            user: req.user.id
        });

        const populatedPost = await Post.findById(post._id).populate('user', 'name');

        res.status(201).json({ success: true, data: populatedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error creating post' });
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Make sure user owns post securely
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'User not authorized to delete this post' });
        }

        await post.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        if(error.kind === 'ObjectId') {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.status(500).json({ success: false, message: 'Server Error deleting post' });
    }
};

// @desc    Like / Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Check if the post has already been liked by this user
        if (post.likes.includes(req.user.id)) {
            // Unlike
            post.likes = post.likes.filter((likeId) => likeId.toString() !== req.user.id.toString());
        } else {
            // Like
            post.likes.push(req.user.id);
        }

        await post.save();
        res.status(200).json({ success: true, data: post.likes });
    } catch (error) {
        if(error.kind === 'ObjectId') {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.status(500).json({ success: false, message: 'Server Error liking post' });
    }
};
