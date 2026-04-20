const express = require('express');
const postController = require('../controllers/post.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', postController.getAllPosts);
router.post('/create', authMiddleware, postController.createPost);
router.put('/update/:id', authMiddleware, postController.updatePost);
router.delete('/delete/:id', authMiddleware, postController.deletePost);


module.exports = router;
