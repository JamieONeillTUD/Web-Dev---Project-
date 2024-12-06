const db = require('../db/connection');

// Get user's dashboard (user data, their recipes, and their favorites)
// Get user's dashboard (user data, their recipes, and their favorites)
exports.getDashboard = async (req, res) => {
    const userId = req.session.userId; // Ensure user ID is in the session

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' }); // User must be logged in
    }

    try {
        // Fetch user data
        const [userData] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (!userData.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch user's own recipes
        const [userRecipes] = await db.query('SELECT * FROM recipes WHERE user_id = ?', [userId]);

        // Fetch user's favorite recipes directly from the favorites table
        const [favorites] = await db.query(`
            SELECT recipe_id, title, image
            FROM favorites
            WHERE user_id = ?
        `, [userId]);

        // Respond with all dashboard data
        res.status(200).json({
            user: userData[0],       // User details
            recipes: userRecipes,   // User's own recipes
            favorites: favorites    // User's favorite recipes
        });
    } catch (error) {
        console.error('Error fetching dashboard:', error);
        res.status(500).json({ error: 'Error fetching dashboard' });
    }
};


exports.getUserDetails = async (req, res) => {
    const userId = req.session.userId; // Get user ID from the session

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' }); // Ensure the user is logged in
    }

    try {
        const query = `
            SELECT first_name, last_name, email, username, phone_number, date_of_birth, eircode
            FROM users
            WHERE id = ?
        `;
        const [userDetails] = await db.query(query, [userId]);

        if (!userDetails.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(userDetails[0]); // Send user details as JSON
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Error fetching user details' });
    }
};

// Fetch user profile details
exports.getProfile = (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    db.query('SELECT first_name, last_name, email, username, phone_number, date_of_birth, eircode FROM users WHERE id = ?', 
        [userId], 
        (err, results) => {
            if (err) {
                console.error('Error fetching user profile:', err);
                return res.status(500).json({ error: 'Error fetching user profile' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(results[0]);
        }
    );
};

// Update user profile
exports.updateProfile = async (req, res) => {
    const userId = req.session.userId;
    const { first_name, last_name, email, phone_number, date_of_birth, eircode } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const query = `
            UPDATE users
            SET first_name = ?, last_name = ?, email = ?, phone_number = ?, date_of_birth = ?, eircode = ?
            WHERE id = ?
        `;
        await db.query(query, [first_name, last_name, email, phone_number, date_of_birth, eircode, userId]);
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};



// Fetch user details
exports.getUserDetails = async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (!user.length) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user[0]); // Send user data as JSON
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Failed to load user details' });
    }
};


