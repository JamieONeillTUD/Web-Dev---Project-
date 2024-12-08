const db = require('../db/connection'); // Ensure that the database connection is correctly set up

/*
Summary:
This file contains various backend functions related to user profiles and dashboard. 
The functions include:
1. Fetching the user's dashboard (user data, recipes, and favorites).
2. Fetching and updating the user's personal details.
3. Handling profile updates and fetching of specific details related to the user.
Each function interacts with the database and returns the appropriate data or error messages.

Author: [Andrea Luca - C22390831 / Jamie O'Neill - C22320302]
Date: [28/10/24] - [06/12/24]
*/

// Get user's dashboard (user data, their recipes, and their favorites)
exports.getDashboard = async (req, res) => {
    const userId = req.session.userId; // Ensure that the user ID is stored in the session

    // If no user ID is found in the session, return an Unauthorized response
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' }); // User must be logged in
    }

    try {
        // Query to get the user data from the 'users' table based on the userId
        const [userData] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (!userData.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Query to get the user's own recipes from the 'recipes' table
        const [userRecipes] = await db.query('SELECT * FROM recipes WHERE user_id = ?', [userId]);

        // Query to get the user's favorite recipes directly from the 'favorites' table
        const [favorites] = await db.query(`
            SELECT recipe_id, title, image
            FROM favorites
            WHERE user_id = ?
        `, [userId]);

        // Respond with all the dashboard data (user details, their recipes, and favorites)
        res.status(200).json({
            user: userData[0],       // User details
            recipes: userRecipes,   // User's own recipes
            favorites: favorites    // User's favorite recipes
        });
    } catch (error) {
        // Log error if there is an issue fetching the data
        console.error('Error fetching dashboard:', error);
        res.status(500).json({ error: 'Error fetching dashboard' });
    }
};

// Fetch user details for profile (GET method)
exports.getUserDetails = async (req, res) => {
    const userId = req.session.userId; // Get user ID from session

    // Check if user is logged in, if not return Unauthorized status
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' }); // Ensure the user is logged in
    }

    try {
        // SQL query to fetch user details from 'users' table
        const query = `
            SELECT first_name, last_name, email, username, phone_number, date_of_birth, eircode
            FROM users
            WHERE id = ?
        `;
        const [userDetails] = await db.query(query, [userId]);

        // If user details are not found, return a not found status
        if (!userDetails.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send the user details as a response
        res.status(200).json(userDetails[0]); // Send user details as JSON
    } catch (error) {
        // If there's an error fetching the user details, log it and send an error response
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Error fetching user details' });
    }
};

// Fetch user profile details (GET method)
exports.getProfile = (req, res) => {
    const userId = req.session.userId; // Get user ID from the session

    // If no user ID is found in session, return Unauthorized status
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Query the database to fetch user profile data
    db.query('SELECT first_name, last_name, email, username, phone_number, date_of_birth, eircode FROM users WHERE id = ?', 
        [userId], 
        (err, results) => {
            // If there's an error in the query, log it and send a server error
            if (err) {
                console.error('Error fetching user profile:', err);
                return res.status(500).json({ error: 'Error fetching user profile' });
            }

            // If no user data is found, return a not found status
            if (results.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Return the user profile details
            res.status(200).json(results[0]);
        }
    );
};

// Update user profile (PUT method)
exports.updateProfile = async (req, res) => {
    const userId = req.session.userId; // Get the user ID from session
    const { first_name, last_name, email, phone_number, date_of_birth, eircode } = req.body; // Extract updated profile data from the request body

    // Check if the user is logged in
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // SQL query to update user profile information
        const query = `
            UPDATE users
            SET first_name = ?, last_name = ?, email = ?, phone_number = ?, date_of_birth = ?, eircode = ?
            WHERE id = ?
        `;
        // Execute the update query
        await db.query(query, [first_name, last_name, email, phone_number, date_of_birth, eircode, userId]);

        // Send a success response once the profile has been updated
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        // If there's an error updating the profile, log the error and send a failure message
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};

// Fetch user details (GET method, duplicate function, could be removed)
exports.getUserDetails = async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Query to fetch all user details
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (!user.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user data as a JSON response
        res.status(200).json(user[0]);
    } catch (error) {
        // Log error if fetching fails
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Failed to load user details' });
    }
};
