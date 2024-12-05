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

module.exports = router;
