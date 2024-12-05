const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth'); // Importing the requireAuth middleware

// Route to get the user's dashboard (Protected route)
router.get('/dashboard', requireAuth, userController.getDashboard);

// Route to get user profile details (Protected route)
router.get('/profile', requireAuth, userController.getUserDetails);

// Route to fetch editable profile details (Protected route)
router.get('/edit-profile', requireAuth, userController.getProfile);

// Route to update user profile (Protected route)
router.post('/edit-profile', requireAuth, userController.updateProfile);

module.exports = router;
