const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to get the user's dashboard (user info, user's recipes, and favorites)
router.get('/dashboard', userController.getDashboard);

router.get('/profile', userController.getUserDetails); // Fetch user details

// Route to get profile details
router.get('/edit-profile', userController.getProfile);

// Route to update profile
router.post('/edit-profile', userController.updateProfile);

router.get('/details', userController.getUserDetails); // API to fetch user data


module.exports = router;
