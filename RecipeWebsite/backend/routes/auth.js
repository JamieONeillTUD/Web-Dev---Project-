const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registration Route
router.post('/register', authController.registerUser);

// Login Route
router.post('/login', authController.loginUser);

req.session.userId = user.id; // Ensure this line is present after successful login

module.exports = router;
