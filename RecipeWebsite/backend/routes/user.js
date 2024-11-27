const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to get the user's dashboard (user info, user's recipes, and favorites)
router.get('/dashboard', userController.getDashboard);

module.exports = router;
