const db = require('../db/connection');

// Get user's dashboard (user data and their recipes)
exports.getDashboard = async (req, res) => {
    const userId = req.userId; // Assume user ID is passed via JWT or session

    try {
        const [userData] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        const [userRecipes] = await db.query('SELECT * FROM recipes WHERE user_id = ?', [userId]);

        if (!userData.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            user: userData[0],
            recipes: userRecipes
        });
    } catch (error) {
        console.error('Error fetching user dashboard:', error);
        res.status(500).json({ error: 'Error fetching dashboard' });
    }
};
