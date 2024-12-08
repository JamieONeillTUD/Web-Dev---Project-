// Import necessary libraries
var bcrypt = require('bcryptjs'); // bcrypt for hashing and comparing passwords
const db = require('../db/connection'); // Importing the database connection

/*
Summary:
This file contains two key functions for user authentication: one for registering a new user and another for logging in an existing user.
The `registerUser` function hashes the password and stores the user data in the database. 
The `loginUser` function compares the provided password with the stored hashed password and verifies the login credentials.

Author: [Jamie O'Neill - C22320301]
Date: [28/10/24] - [27/11/24]
*/

// User registration function
exports.registerUser = async (req, res) => {
    const { first_name, last_name, username, email, password } = req.body; // Destructuring the user input data from the request body

    try {
        // Hash the password using bcrypt with a salt rounds value of 10
        const hashedPassword = await bcrypt.hash(password, 10);

        // SQL query to insert the new user into the 'users' table
        const query = 'INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)';
        // Execute the query with the provided data
        const result = await db.query(query, [first_name, last_name, username, email, hashedPassword]);

        // Send a success response back to the client
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        // Log and send an error response in case of failure
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
};

// User login function
exports.loginUser = async (req, res) => {
    const { username, password } = req.body; // Destructuring the login credentials from the request body

    try {
        // SQL query to fetch the user data based on the provided username
        const query = 'SELECT * FROM users WHERE username = ?';
        const [user] = await db.query(query, [username]);

        // Check if user exists and if the provided password matches the stored hashed password
        if (user && await bcrypt.compare(password, user.password)) {
            // Successful login response
            res.status(200).json({ message: 'Login successful' });
        } else {
            // Invalid credentials error response
            res.status(400).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        // Log and send an error response in case of failure
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Error logging in' });
    }
};
