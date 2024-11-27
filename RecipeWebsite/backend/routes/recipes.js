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
router.post('/:id/favorites', recipeController.addFavorite);

router.get('/favorites', recipeController.getFavorites);

// DELETE: Remove a favorite
router.delete('/:id/favorites', recipeController.removeFavorite);


module.exports = router;
