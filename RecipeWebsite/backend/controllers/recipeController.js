const db = require('../db/connection');

// Add a new recipe (POST)
exports.addRecipe = async (req, res) => {
    const { title, description, ingredients, instructions } = req.body;
    const userId = req.session.userId; // Get the logged-in user's ID from session

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized, please log in' }); // Make sure the user is logged in
    }

    if (!title || !description || !ingredients || !instructions) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const query = 'INSERT INTO recipes (user_id, title, description, ingredients, instructions) VALUES (?, ?, ?, ?, ?)';
        const result = await db.query(query, [userId, title, description, ingredients, instructions]);
        res.status(201).json({ message: 'Recipe added successfully', recipeId: result[0].insertId });
    } catch (error) {
        console.error('Error adding recipe:', error);
        res.status(500).json({ error: 'Error adding recipe' });
    }
};

// Other recipe controller methods (like getAllRecipes, getRecipeById, etc.) here
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

// Add a recipe to favorites
exports.addFavorite = async (req, res) => {
    const recipeId = req.params.id;
    const userId = req.session.userId; // Get user ID from session

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const query = 'INSERT INTO favorites (user_id, recipe_id) VALUES (?, ?)';
        await db.query(query, [userId, recipeId]);
        res.status(200).json({ message: 'Recipe added to favorites' });
    } catch (error) {
        console.error('Error adding recipe to favorites:', error);
        res.status(500).json({ error: 'Error adding to favorites' });
    }
};

// Get user favorites
exports.getFavorites = async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const query = `
            SELECT r.* 
            FROM recipes r
            JOIN favorites f ON r.id = f.recipe_id
            WHERE f.user_id = ?
        `;
        const [favorites] = await db.query(query, [userId]);
        res.status(200).json(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Error fetching favorites' });
    }
};

// Remove a recipe from favorites
exports.removeFavorite = async (req, res) => {
    const recipeId = req.params.id;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const query = 'DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?';
        const [result] = await db.query(query, [userId, recipeId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        res.status(200).json({ message: 'Favorite removed successfully' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ error: 'Error removing favorite' });
    }
};
