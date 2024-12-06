// const express = require('express');
// const db = require('../db/connection'); // Ensure this matches your setup
// const router = express.Router();

// router.post('/favorites', async (req, res) => {
//     const { id, title, image } = req.body;
//     const userId = req.session.userId; // Ensure the user is logged in

//     if (!userId) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }

//     try {
//         const query = `
//             INSERT INTO favorites (user_id, recipe_id, title, image) 
//             VALUES (?, ?, ?, ?)
//             ON DUPLICATE KEY UPDATE recipe_id=recipe_id
//         `;
//         await db.query(query, [userId, id, title, image]);
//         res.status(200).json({ message: 'Recipe added to favorites!' });
//     } catch (error) {
//         console.error('Error adding recipe to favorites:', error);
//         res.status(500).json({ message: 'Error adding recipe to favorites.' });
//     }
// });

// module.exports = router;
