const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);

module.exports = router;
