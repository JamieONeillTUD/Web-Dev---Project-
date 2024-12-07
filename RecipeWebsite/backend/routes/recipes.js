const express = require('express');
const router = express.Router();
const path = require('path'); // Fix: Import the path module
const recipeController = require('../controllers/recipeController');
const db = require('../db/connection');

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


// Route to delete a recipe
router.delete('/delete/:id', (req, res) => {
    const recipeId = req.params.id;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    db.query('DELETE FROM recipes WHERE id = ? AND user_id = ?', [recipeId, userId], (err, results) => {
        if (err) {
            console.error('Error deleting recipe:', err);
            return res.status(500).json({ message: 'Recipe deleted successfully' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Recipe not found or you are not the owner' });
        }

        res.status(200).json({ message: 'Recipe deleted successfully' });
    });
});

module.exports = router;