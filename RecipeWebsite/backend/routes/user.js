const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get user's dashboard (user data and their recipes)
router.get('/dashboard', userController.getDashboard);

module.exports = router;
