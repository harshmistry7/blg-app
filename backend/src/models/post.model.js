const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    imageUrl: {
        type: String,
    },
}, { timestamps: true })

const postModel = mongoose.model("Post", postSchema)

module.exports = postModel