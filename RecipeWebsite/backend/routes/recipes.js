const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// Create a new recipe (POST route)
router.post('/add', recipeController.addRecipe);

// Other routes related to recipes (as you had before)
router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);
router.put('/:id', recipeController.updateRecipe);
router.delete('/:id', recipeController.deleteRecipe);
router.post('/:id/favorites', recipeController.addFavorite);
router.get('/favorites', recipeController.getFavorites);
router.delete('/:id/favorites', recipeController.removeFavorite);

module.exports = router;
