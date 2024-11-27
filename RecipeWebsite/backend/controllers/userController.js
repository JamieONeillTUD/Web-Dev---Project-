const db = require('../db/connection');

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

        // Fetch user's favorite recipes
        const [favorites] = await db.query(`
            SELECT r.* 
            FROM recipes r
            JOIN favorites f ON r.id = f.recipe_id
            WHERE f.user_id = ?
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

