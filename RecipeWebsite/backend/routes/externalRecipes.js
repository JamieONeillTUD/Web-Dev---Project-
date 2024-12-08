// externalRecipes.js
// This file contains routes for interacting with the external recipe API (TheMealDB).
// It provides endpoints for fetching recipes based on search queries, retrieving detailed recipes by ID,
// fetching available cuisines and categories, and applying filters like ingredients, cuisine, and category to search recipes.

// Import necessary modules
const express = require('express');  // Express framework to handle HTTP requests
const axios = require('axios');    // Axios library to make HTTP requests to external API
const router = express.Router();    // Router to define routes for the app

// Fetch recipes based on a search query or fetch default recipes
// The '/recipes' route is used to get a list of recipes, either based on a search query or all recipes.
router.get('/recipes', async (req, res) => {
    const query = req.query.q || ''; // Default to empty query for fetching all recipes
    try {
        const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
        const response = await axios.get(url); // Make GET request to external API
        if (response.data.meals) {
            res.json(response.data.meals); // Return recipes to the client
        } else {
            res.json([]); // Return empty array if no meals found
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);  // Log any errors
        res.status(500).json({ message: 'Error fetching recipes' });  // Send error response if the API call fails
    }
});

// Fetch detailed recipe by ID
// The '/recipe/:id' route is used to get a single recipe's details based on its ID
router.get('/recipe/:id', async (req, res) => {
    const recipeId = req.params.id; // Get the recipe ID from the URL parameter
    try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
        if (response.data.meals) {
            res.json(response.data.meals[0]); // Return the recipe details to the client
        } else {
            res.status(404).json({ message: 'Recipe not found' }); // Return 404 if recipe is not found
        }
    } catch (error) {
        console.error('Error fetching recipe details:', error);  // Log any errors
        res.status(500).json({ message: 'Error fetching recipe details' }); // Send error response if the API call fails
    }
});

// Cuisines Route
// The '/cuisines' route is used to fetch a list of available cuisines
router.get('/cuisines', async (req, res) => {
    try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
        res.json(response.data.meals || []); // Return the list of cuisines or empty array if no cuisines found
    } catch (error) {
        console.error("Error fetching cuisines:", error);  // Log any errors
        res.status(500).json({ message: "Error fetching cuisines" });  // Send error response if the API call fails
    }
});

// Categories Route
// The '/categories' route is used to fetch a list of available recipe categories
router.get('/categories', async (req, res) => {
    try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
        res.json(response.data.meals || []); // Return the list of categories or empty array if no categories found
    } catch (error) {
        console.error("Error fetching categories:", error);  // Log any errors
        res.status(500).json({ message: "Error fetching categories" });  // Send error response if the API call fails
    }
});

// Search Recipes Route with filters or return default recipes
// The '/search' route allows searching for recipes with multiple filters: ingredient, cuisine, category, or search query
router.get('/search', async (req, res) => {
    const { q, ingredient, cuisine, category } = req.query;  // Extract query parameters from the request
    let url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';  // Default URL for searching recipes

    try {
        // Update the URL based on the query parameters provided
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

        const response = await axios.get(url);  // Make GET request to external API with the constructed URL
        res.json(response.data.meals || []);  // Return the search results or empty array if no meals found
    } catch (error) {
        console.error("Error searching recipes:", error);  // Log any errors
        res.status(500).json({ message: "Error searching recipes" });  // Send error response if the API call fails
    }
});

// Export the router so it can be used in other parts of the application
module.exports = router;
