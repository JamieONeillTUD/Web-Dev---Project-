const express = require('express');
const router = express.Router();
const path = require('path'); // Fix: Import the path module
const recipeController = require('../controllers/recipeController');

// Serve the create recipe page
router.get('/create', (req, res) => {
    // Correct the path to point to the frontend folder located outside backend
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'public', 'create-recipe.html'));
});

// Other routes
router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);
router.post('/add', recipeController.addRecipe);
router.put('/:id', recipeController.updateRecipe);
router.delete('/:id', recipeController.deleteRecipe);
router.post('/:id/favorites', recipeController.addFavorite);
router.get('/favorites', recipeController.getFavorites);
router.delete('/:id/favorites', recipeController.removeFavorite);

module.exports = router;
