// recipes.js
// This file defines routes for managing recipes, including creating, viewing, updating, deleting recipes,
// and managing user favorites. It interacts with both the local database and user sessions to ensure proper 
// access control. The routes are handled through the Express router and linked to functions in the 
// recipeController for database interaction. This file also serves the frontend page for creating a new recipe.

// Import necessary modules
const express = require('express');  // Express framework for routing
const router = express.Router();  // Initialize the Express router
const path = require('path'); // Module to handle file paths
const recipeController = require('../controllers/recipeController');  // Controller that manages recipe-related actions
const db = require('../db/connection');  // Database connection module

// Serve the create recipe page
// This route serves the HTML page where users can create a new recipe.
router.get('/create', (req, res) => {
    // Correct the path to point to the frontend folder located outside the backend
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'public', 'create-recipe.html'));
});

// Other routes
// Route to get all recipes
router.get('/', recipeController.getAllRecipes);  // This route fetches and returns all recipes
// Route to get a recipe by its ID
router.get('/:id', recipeController.getRecipeById);  // This route fetches and returns a recipe by its ID
// Route to add a new recipe
router.post('/add', recipeController.addRecipe);  // This route adds a new recipe to the database
// Route to update an existing recipe
router.put('/:id', recipeController.updateRecipe);  // This route updates the recipe details by its ID
// Route to delete a recipe
router.delete('/:id', recipeController.deleteRecipe);  // This route deletes a recipe by its ID
// Route to add a recipe to the user's favorites
router.post('/:id/favorites', recipeController.addFavorite);  // This route adds a recipe to the favorites list
// Route to get the user's favorite recipes
router.get('/favorites', recipeController.getFavorites);  // This route fetches the list of the user's favorite recipes
// Route to remove a recipe from the user's favorites
router.delete('/:id/favorites', recipeController.removeFavorite);  // This route removes a recipe from the favorites list

// Route to delete a recipe (handles logic for both authentication and deletion)
router.delete('/delete/:id', (req, res) => {
    const recipeId = req.params.id;  // Get the recipe ID from the URL parameters
    const userId = req.session.userId;  // Get the logged-in user's ID from the session

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });  // Ensure the user is logged in
    }

    // SQL query to delete the recipe from the database
    db.query('DELETE FROM recipes WHERE id = ? AND user_id = ?', [recipeId, userId], (err, results) => {
        if (err) {
            console.error('Error deleting recipe:', err);  // Log the error if there is an issue with the query
            return res.status(500).json({ message: 'Error deleting recipe' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Recipe not found or you are not the owner' });  // Handle case where recipe is not found or user is not the owner
        }

        res.status(200).json({ message: 'Recipe deleted successfully' });  // Successfully deleted the recipe
    });
});

// Export the router so it can be used in other parts of the application
module.exports = router;
