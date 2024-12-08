// user.js
// This file defines the routes for managing user data, including fetching user information,
// displaying the user's dashboard, allowing profile updates, and fetching detailed user data.
// These routes are handled through Express and interact with the userController to fetch or modify
// data from the database, including user details and recipes.

const express = require('express');  // Import the express framework
const router = express.Router();  // Initialize an Express router to define routes
const userController = require('../controllers/userController');  // Import the userController which handles business logic

// Route to get the user's dashboard (user info, user's recipes, and favorites)
router.get('/dashboard', userController.getDashboard);  // Fetch the user's dashboard which includes their recipes and favorites

// Route to fetch the user's details
router.get('/profile', userController.getUserDetails);  // Fetch user details like name, email, etc.

// Route to get profile details (for editing purposes)
router.get('/edit-profile', userController.getProfile);  // Get the user's current profile information for editing

// Route to update the user's profile
router.post('/edit-profile', userController.updateProfile);  // Update the user's profile with new information

// Route to fetch the user details through an API endpoint
router.get('/details', userController.getUserDetails);  // Fetch detailed user data via the API

// Export the router to be used in other parts of the application
module.exports = router;
