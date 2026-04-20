const express = require('express');
const postController = require('../controllers/post.controller');

const router = express.Router();

router.get('/', postController.getAllPosts);

router.post('/create', postController.createPost);
router.get('/all', postController.getAllPosts);
router.get('/get', postController.getAllPosts);


module.exports = router;
