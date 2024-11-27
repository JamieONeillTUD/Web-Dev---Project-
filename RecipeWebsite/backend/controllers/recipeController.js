const db = require('../db/connection');

// Get all recipes
exports.getAllRecipes = async (req, res) => {
    try {
        const [recipes] = await db.query('SELECT * FROM recipes');
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Error fetching recipes' });
    }
};

// Get a single recipe by id
exports.getRecipeById = async (req, res) => {
    const { id } = req.params;

    try {
        const [recipe] = await db.query('SELECT * FROM recipes WHERE id = ?', [id]);
        if (recipe.length === 0) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(200).json(recipe[0]);
    } catch (error) {
        console.error('Error fetching recipe by ID:', error);
        res.status(500).json({ error: 'Error fetching recipe' });
    }
};

// Add a new recipe
exports.addRecipe = async (req, res) => {
    const { user_id, title, description, ingredients, instructions } = req.body;

    try {
        const query = 'INSERT INTO recipes (user_id, title, description, ingredients, instructions) VALUES (?, ?, ?, ?, ?)';
        const result = await db.query(query, [user_id, title, description, ingredients, instructions]);
        res.status(201).json({ message: 'Recipe added successfully', recipeId: result[0].insertId });
    } catch (error) {
        console.error('Error adding recipe:', error);
        res.status(500).json({ error: 'Error adding recipe' });
    }
};

// Update a recipe
exports.updateRecipe = async (req, res) => {
    const { id } = req.params;
    const { title, description, ingredients, instructions } = req.body;

    try {
        const query = 'UPDATE recipes SET title = ?, description = ?, ingredients = ?, instructions = ? WHERE id = ?';
        const result = await db.query(query, [title, description, ingredients, instructions, id]);

        if (result[0].affectedRows === 0) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.status(200).json({ message: 'Recipe updated successfully' });
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ error: 'Error updating recipe' });
    }
};

// Delete a recipe
exports.deleteRecipe = async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM recipes WHERE id = ?';
        const result = await db.query(query, [id]);

        if (result[0].affectedRows === 0) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ error: 'Error deleting recipe' });
    }
};


// Get user favorites
exports.getFavorites = async (req, res) => {
    const userId = req.session.userId; // Get the logged-in user's ID from the session

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' }); // User must be logged in
    }

    try {
        const query = `
            SELECT r.* 
            FROM recipes r
            JOIN favorites f ON r.id = f.recipe_id
            WHERE f.user_id = ?
        `;
        const [favorites] = await db.query(query, [userId]); // Fetch favorites for the user
        res.status(200).json(favorites); // Return favorites as JSON
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Error fetching favorites' }); // Handle errors gracefully
    }
};

