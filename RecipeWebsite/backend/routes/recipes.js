const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const requireAuth = require('../middleware/requireAuth'); // Importing the requireAuth middleware

// Get all recipes (Public route, no authentication required)
router.get('/', recipeController.getAllRecipes);

// Get a single recipe by id (Public route, no authentication required)
router.get('/:id', recipeController.getRecipeById);

// Create a new recipe (Protected route, requires authentication)
router.post('/add', requireAuth, recipeController.addRecipe);

// Update a recipe (Protected route, requires authentication)
router.put('/:id', requireAuth, recipeController.updateRecipe);

// Delete a recipe (Protected route, requires authentication)
router.delete('/:id', requireAuth, recipeController.deleteRecipe);

// Add a recipe to favorites (Protected route, requires authentication)
router.post('/:id/favorites', requireAuth, recipeController.addFavorite);

// Get all user favorites (Protected route, requires authentication)
router.get('/favorites', requireAuth, recipeController.getFavorites);

// DELETE: Remove a favorite (Protected route, requires authentication)
router.delete('/:id/favorites', requireAuth, recipeController.removeFavorite);

module.exports = router;
