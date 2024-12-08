const db = require('../db/connection'); // Database connection for querying

/*
Summary:
This file contains various API methods to manage recipes in the application, including:
- Adding, updating, deleting recipes
- Managing user favorites (adding, removing, fetching)
Each function handles specific database operations and returns appropriate success/error responses.

Author: [Andrea Luca - C22390831 / Jamie O'Neill - C22320302]
Date: [28/10/24] - [06/12/24]
*/

// Add a new recipe (POST method)
exports.addRecipe = async (req, res) => {
    // Extract recipe details from the request body and user ID from session
    const { title, description, ingredients, instructions } = req.body;
    const userId = req.session.userId;

    // Ensure the user is logged in
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized, please log in' });
    }

    // Ensure all required fields are provided
    if (!title || !description || !ingredients || !instructions) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // SQL query to insert a new recipe
        const query = 'INSERT INTO recipes (user_id, title, description, ingredients, instructions) VALUES (?, ?, ?, ?, ?)';
        const result = await db.query(query, [userId, title, description, ingredients, instructions]);

        // Return success message with the inserted recipe's ID
        res.status(201).json({ message: 'Recipe added successfully', recipeId: result[0].insertId });
    } catch (error) {
        // Log and handle any errors that occur
        console.error('Error adding recipe:', error);
        res.status(500).json({ error: 'Error adding recipe' });
    }
};

// Get all recipes (GET method)
exports.getAllRecipes = async (req, res) => {
    try {
        // SQL query to fetch all recipes
        const [recipes] = await db.query('SELECT * FROM recipes');
        res.status(200).json(recipes); // Return the list of recipes as JSON
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Error fetching recipes' });
    }
};

// Get a specific recipe by ID (GET method)
exports.getRecipeById = async (req, res) => {
    const { id } = req.params; // Extract recipe ID from URL parameters

    try {
        console.log(`Fetching recipe with ID: ${id}`); // Debugging
        // SQL query to fetch a specific recipe by ID
        const [recipe] = await db.query('SELECT * FROM recipes WHERE id = ?', [id]);
        
        // Check if recipe exists
        if (recipe.length === 0) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.status(200).json(recipe[0]); // Return the recipe data
    } catch (error) {
        console.error('Error fetching recipe by ID:', error);
        res.status(500).json({ error: 'Error fetching recipe' });
    }
};

// Update a recipe (PUT method)
exports.updateRecipe = async (req, res) => {
    const { id } = req.params; // Extract recipe ID from URL parameters
    const { title, description, ingredients, instructions } = req.body; // Extract updated recipe details from request body

    try {
        // SQL query to update recipe details
        const query = 'UPDATE recipes SET title = ?, description = ?, ingredients = ?, instructions = ? WHERE id = ?';
        const result = await db.query(query, [title, description, ingredients, instructions, id]);

        // Check if recipe was found and updated
        if (result[0].affectedRows === 0) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.status(200).json({ message: 'Recipe updated successfully' }); // Return success message
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ error: 'Error updating recipe' });
    }
};

// Delete a recipe (DELETE method)
exports.deleteRecipe = async (req, res) => {
    const { id } = req.params; // Extract recipe ID from URL parameters

    try {
        // SQL query to delete a specific recipe by ID
        const query = 'DELETE FROM recipes WHERE id = ?';
        const result = await db.query(query, [id]);

        // Check if recipe was deleted
        if (result[0].affectedRows === 0) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.status(200).json({ message: 'Recipe deleted successfully' }); // Return success message
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ error: 'Error deleting recipe' });
    }
};

// Add a recipe to favorites (POST method)
exports.addFavorite = async (req, res) => {
    const { recipe_id, title, image } = req.body; // Recipe details
    const userId = req.session.userId; // Get user ID from session

    console.log('Received data:', { recipe_id, title, image, userId }); // Debugging

    // Ensure the user is logged in
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // SQL query to insert a new favorite recipe
        const query = `
            INSERT INTO favorites (user_id, recipe_id, title, image)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE recipe_id = recipe_id
        `;
        await db.query(query, [userId, recipe_id, title, image]);

        res.status(200).json({ message: 'Recipe added to favorites!' }); // Return success message
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ message: 'Error adding to favorites.' });
    }
};

// Get user's favorite recipes (GET method)
exports.getFavorites = async (req, res) => {
    const userId = req.session.userId;

    // Ensure the user is logged in
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // SQL query to get all favorite recipes for the logged-in user
        const query = `
            SELECT recipe_id, title, image 
            FROM favorites 
            WHERE user_id = ?
        `;
        const [favorites] = await db.query(query, [userId]);
        res.status(200).json(favorites); // Return favorite recipes as JSON
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Error fetching favorites' });
    }
};

// Remove a recipe from favorites (DELETE method)
exports.removeFavorite = async (req, res) => {
    const recipeId = req.params.id; // Extract recipe ID from URL parameters
    const userId = req.session.userId; // Get user ID from session

    console.log(`Attempting to delete: Recipe ID = ${recipeId}, User ID = ${userId}`); // Debugging

    // Ensure the user is logged in
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // SQL query to delete a favorite recipe by recipe ID and user ID
        const query = 'DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?';
        const [result] = await db.query(query, [userId, recipeId]);

        console.log(`Deletion Result: ${JSON.stringify(result)}`); // Debugging

        // Check if the favorite recipe was deleted
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        res.status(200).json({ message: 'Favorite removed successfully' }); // Return success message
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ error: 'Error removing favorite' });
    }
};
