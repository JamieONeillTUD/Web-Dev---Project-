const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const db = require('../db/connection'); 

// Get all recipes
router.get('/', recipeController.getAllRecipes);

// Get a single recipe by id
router.get('/:id', recipeController.getRecipeById);

// Create a new recipe
router.post('/add', recipeController.addRecipe);

// Update a recipe
router.put('/:id', recipeController.updateRecipe);

// Delete a recipe
router.delete('/:id', recipeController.deleteRecipe);

// Add a recipe to favorites
// Route handles the POST request when the user clicks the "Add to Favorites" button
router.post('/:id/favorites', async (req, res) => {
    const recipeId = req.params.id; // Get the recipe ID from the URL
    const userId = req.session.userId; // Get the logged-in user ID from the session

    if (!userId) {
        return res.status(401).send('Unauthorized'); // User must be logged in
    }

    try {
        // Insert the favorite into the database
        const query = 'INSERT INTO favorites (user_id, recipe_id) VALUES (?, ?)';
        await db.query(query, [userId, recipeId]);
        res.redirect('/'); // Redirect back to the homepage after adding to favorites
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).send('Recipe is already in favorites.');
        } else {
            console.error('Error adding to favorites:', error.message); // Log detailed error
            res.status(500).send(`Error adding to favorites: ${error.message}`); // Send detailed error to the client
            
        }
    }
});


module.exports = router;
