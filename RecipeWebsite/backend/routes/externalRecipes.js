const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/recipes', async (req, res) => {
    const query = req.query.q; // Get the search query from the request
    if (!query) {
        return res.status(400).json({ message: 'Query is required' });
    }

    try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        if (response.data.meals) {
            res.json(response.data.meals); // Return recipes to the client
        } else {
            res.json([]); // Return empty array if no meals found
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching recipes' });
    }
});

// Fetch detailed recipe by ID
router.get('/recipe/:id', async (req, res) => {
    const recipeId = req.params.id; // Get the recipe ID from the URL
    try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
        if (response.data.meals) {
            res.json(response.data.meals[0]); // Return the recipe details
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        res.status(500).json({ message: 'Error fetching recipe details' });
    }
});

module.exports = router;
