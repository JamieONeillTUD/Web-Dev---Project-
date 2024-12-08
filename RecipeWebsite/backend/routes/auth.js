// auth.js
// This file contains routes for user authentication: registration and login.
// It uses the 'express' framework and connects to the 'authController' to handle 
// the logic for registering and logging in users.

// Import necessary modules
const express = require('express');         // Import express framework
const router = express.Router();           // Create a new router instance to define routes
const authController = require('../controllers/authController'); // Import the controller to handle authentication logic

// Registration Route
// This route handles user registration. It expects a POST request with the user data.
router.post('/register', authController.registerUser); // When the '/register' route is hit, the registerUser method is invoked

// Login Route
// This route handles user login. It expects a POST request with login credentials.
router.post('/login', authController.loginUser); // When the '/login' route is hit, the loginUser method is invoked

// After a successful login, store the user ID in the session
req.session.userId = user.id; 
// This line ensures that the user is logged in by associating their user ID with the session.

// Export the router to use in other parts of the application
module.exports = router; // Export the router instance to make it available in other files
