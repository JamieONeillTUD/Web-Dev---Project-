const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registration Route
router.post('/register', authController.registerUser);

// Login Route
router.post('/login', authController.loginUser);

module.exports = router;
