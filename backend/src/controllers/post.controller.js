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

async function updatePost(req, res) {
    const { id } = req.params;
    const { title, content, imageUrl } = req.body;

    const post = await postModel.findById(id);

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
        return res.status(403).json({ message: "Forbidden: not your post" });
    }

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (imageUrl !== undefined) post.imageUrl = imageUrl;

    await post.save();

    return res.status(200).json({
        message: "Post updated successfully",
        post
    });
}

async function deletePost(req, res) {
    const { id } = req.params;

    const post = await postModel.findById(id);

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
        return res.status(403).json({ message: "Forbidden: not your post" });
    }

    await postModel.findByIdAndDelete(id);

    return res.status(200).json({
        message: "Post deleted successfully"
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
    getPosts,
    updatePost,
    deletePost
};