const express = require('express');
const axios = require('axios');
const router = express.Router();

// Fetch recipes based on a search query or fetch default recipes
router.get('/recipes', async (req, res) => {
    const query = req.query.q || ''; // Default to empty query for fetching all recipes
    try {
        const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
        const response = await axios.get(url);
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

// Cuisines Route
router.get('/cuisines', async (req, res) => {
    try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
        res.json(response.data.meals || []);
    } catch (error) {
        console.error("Error fetching cuisines:", error);
        res.status(500).json({ message: "Error fetching cuisines" });
    }
});

// Categories Route
router.get('/categories', async (req, res) => {
    try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
        res.json(response.data.meals || []);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Error fetching categories" });
    }
});

// Search with filters or return default recipes
// Search Recipes Route
router.get('/search', async (req, res) => {
    const { q, ingredient, cuisine, category } = req.query;
    let url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

    try {
        if (ingredient) {
            url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;
        }
        if (cuisine) {
            url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${cuisine}`;
        }
        if (category) {
            url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
        }
        if (q) {
            url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${q}`;
        }

        const response = await axios.get(url);
        res.json(response.data.meals || []);
    } catch (error) {
        console.error("Error searching recipes:", error);
        res.status(500).json({ message: "Error searching recipes" });
    }
});


module.exports = router;
