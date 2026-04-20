const postModel = require('../models/post.model');

async function getAllPosts(req, res) {
    const posts = await postModel.find().populate('author', 'username');
    res.status(200).json({
        message: "Posts retrieved successfully",
        posts
    });
}

async function createPost(req, res) {

    const { title, content } = req.body;
    const author = req.user.id;

    const post = await postModel.create({
        title,
        content,
        author
    });

    res.status(201).json({
        message: "Post created successfully",
        post
    });
}

async function getPosts(req, res) {
    const posts = await postModel.find().populate('author', 'username');
    res.status(200).json({
        message: "Posts retrieved successfully",
        posts
    });
}

module.exports = {
    getAllPosts,
    createPost,
    getPosts    
};