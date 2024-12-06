const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const app = express();
const port = 5050;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Middleware for JSON parsing

// Use express-session to manage sessions
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Change secure to true if using HTTPS
}));

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Your MySQL password
    database: 'recipe_website' // Your MySQL database
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Database connected successfully!');
});

// Import recipes router
const recipesRouter = require('./routes/recipes');
app.use('/recipes', recipesRouter);

// external recipes
const externalRecipesRouter = require('./routes/externalRecipes');
app.use('/api', externalRecipesRouter); // Mount the router

// // for favourites external recipes
// const favoritesRouter = require('./routes/favorites');
// app.use('/api', favoritesRouter);

const recipeController = require('./controllers/recipeController');
app.post('/recipes/favorites', recipeController.addFavorite);


// Serve static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));

// Serve HTML files
app.get('/', (req, res) => {
    const userId = req.session.userId;
    const navbarLinks = userId ? `
        <li class="nav-item"><a class="nav-link" href="/user/dashboard">Dashboard</a></li>
        <li class="nav-item"><a class="nav-link" href="/recipes/add">Create Recipe</a></li>
        <li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li>
    ` : `
        <li class="nav-item"><a class="nav-link" href="/login.html">Login</a></li>
        <li class="nav-item"><a class="nav-link" href="/register.html">Register</a></li>
    `;

    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'), { navbarLinks });
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
});
app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'register.html'));
});

// Handle registration form submission (POST)
app.post('/register', (req, res) => {
    const { first_name, last_name, username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err.message);
            return res.status(500).send('Error hashing password');
        }

        const query = 'INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [first_name, last_name, username, email, hashedPassword], (err) => {
            if (err) {
                console.error('Error registering user:', err.message);
                return res.status(500).send('Error registering user');
            }
            res.redirect('/login.html');
        });
    });
});

// Handle login form submission (POST)
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error during login:', err.message);
            return res.status(500).send('Error during login');
        }

        if (results.length === 0) {
            return res.status(401).send('Invalid credentials');
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err.message);
                return res.status(500).send('Error comparing passwords');
            }

            if (!isMatch) {
                return res.status(401).send('Invalid credentials');
            }

            req.session.userId = user.id; // Store user ID in session
            res.redirect('/user/dashboard');
        });
    });
});

// Serve the dashboard page if the user is logged in
app.get('/user/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login.html'); // Redirect to login if not logged in
    }

    const userId = req.session.userId;

    // Fetch user details, recipes, and favorites
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err.message);
            return res.status(500).send('Error fetching user data');
        }

        if (results.length === 0) {
            return res.status(404).send('User not found');
        }

        const user = results[0];
        db.query('SELECT * FROM recipes WHERE user_id = ?', [userId], (err, recipes) => {
            if (err) {
                console.error('Error fetching recipes:', err.message);
                return res.status(500).send('Error fetching recipes');
            }

            // Fetch favorites from the "favorites" table with title and image
            db.query(
                'SELECT title, image FROM favorites WHERE user_id = ?',
                [userId],
                (err, favorites) => {
                    if (err) {
                        console.error('Error fetching favorites:', err.message);
                        return res.status(500).send('Error fetching favorites');
                    }

                    // Render dashboard
                    res.send(`
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Your Dashboard - Recipe Website</title>
                            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
                            <style>
                                .card img {
                                    max-height: 200px;
                                    object-fit: cover;
                                }
                            </style>
                        </head>
                        <body>
                            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                                <div class="container-fluid">
                                    <a class="navbar-brand" href="/">Recipe Website</a>
                                    <div class="collapse navbar-collapse" id="navbarNav">
                                        <ul class="navbar-nav ms-auto">
                                            <li class="nav-item"><a class="nav-link" href="/user/dashboard">Dashboard</a></li>
                                            <li class="nav-item"><a class="nav-link" href="/recipes/add">Create Recipe</a></li>
                                            <li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </nav>
                            <div class="container py-5">
                                <h1 class="display-4">Welcome, ${user.first_name}!</h1>
                                <h3>Edit Profile</h3>
                                <form id="updateProfileForm">
                                    <div class="mb-3">
                                        <label for="first_name" class="form-label">First Name</label>
                                        <input type="text" class="form-control" id="first_name" name="first_name" value="${user.first_name}">
                                    </div>
                                    <div class="mb-3">
                                        <label for="last_name" class="form-label">Last Name</label>
                                        <input type="text" class="form-control" id="last_name" name="last_name" value="${user.last_name}">
                                    </div>
                                    <div class="mb-3">
                                        <label for="email" class="form-label">Email</label>
                                        <input type="email" class="form-control" id="email" name="email" value="${user.email}">
                                    </div>
                                    <button type="submit" class="btn btn-primary">Update Profile</button>
                                </form>
                                <h3>Your Recipes</h3>
                                <ul class="list-group">
                                    ${recipes.map(recipe => `
                                        <li class="list-group-item">
                                            <h5>${recipe.title}</h5>
                                            <p>${recipe.description}</p>
                                        </li>
                                    `).join('')}
                                </ul>
                                <h3>Your Favorites</h3>
                                <div class="row">
                                    ${favorites.map(fav => `
                                        <div class="col-md-4">
                                            <div class="card">
                                                <img src="${fav.image}" class="card-img-top" alt="${fav.title}">
                                                <div class="card-body">
                                                    <h5 class="card-title">${fav.title}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <script>
                                document.getElementById('updateProfileForm').addEventListener('submit', async (event) => {
                                    event.preventDefault();
                                    const formData = new FormData(event.target);
                                    const data = Object.fromEntries(formData.entries());
                                    try {
                                        const response = await fetch('/user/update-profile', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(data)
                                        });
                                        if (response.ok) {
                                            alert('Profile updated successfully!');
                                        } else {
                                            alert('Failed to update profile.');
                                        }
                                    } catch (error) {
                                        console.error('Error:', error);
                                    }
                                });
                            </script>
                        </body>
                        </html>
                    `);
                }
            );
        });
    });
});





// Update user profile
app.post('/user/update-profile', (req, res) => {
    const userId = req.session.userId;
    const { first_name, last_name, email } = req.body;

    db.query(
        'UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?',
        [first_name, last_name, email, userId],
        (err) => {
            if (err) {
                console.error('Error updating profile:', err.message);
                return res.status(500).send('Error updating profile');
            }
            res.status(200).json({ message: 'Profile updated successfully' });
        }
    );
});

// search route that handles searching for a recipe
app.get('/search', (req, res) => {
    const searchQuery = req.query.query;

    const sqlQuery = `
        SELECT * FROM recipes 
        WHERE title LIKE ? OR description LIKE ?`;

    db.query(sqlQuery, [`%${searchQuery}%`, `%${searchQuery}%`], (err, results) => {
        if (err) {
            console.error('Error fetching recipes:', err.message);
            return res.status(500).send('Error fetching recipes');
        }

        if (results.length === 0) {
            res.send(`
                <div class="container py-5">
                    <h1 class="text-center">No Results Found for "${searchQuery}"</h1>
                    <p class="text-center">Try searching for something else.</p>
                </div>
            `);
        } else {
            // pass the search results to the search results page
            res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Search Results</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body>
                    <div class="container py-5">
                        <h1 class="text-center mb-4">Search Results for "${searchQuery}"</h1>
                        <div class="row">
                            ${results.map(recipe => `
                                <div class="col-md-4 mb-4">
                                    <div class="card">
                                        <img src="/images/${recipe.image || 'default.jpg'}" class="card-img-top" alt="${recipe.title}">
                                        <div class="card-body">
                                            <h5 class="card-title">${recipe.title}</h5>
                                            <p class="card-text">${recipe.description}</p>
                                            <a href="/recipe.html?id=${recipe.id}" class="btn btn-primary">View Recipe</a>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </body>
                </html>
            `);
        }
    });
});

// Serve Create Recipe page
app.get('/recipes/add', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login.html'); // Ensure the user is logged in before they can access this page
    }
    res.sendFile(path.join(__dirname, '..', 'frontend', 'create-recipe.html')); // Send the create recipe page
});

// Create Recipe (POST)
app.post('/recipes/add', (req, res) => {
    const { title, description, ingredients, instructions } = req.body;
    const userId = req.session.userId; // Make sure the user is logged in

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized, please log in' });
    }

    if (!title || !description || !ingredients || !instructions) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO recipes (user_id, title, description, ingredients, instructions) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [userId, title, description, ingredients, instructions], (err, result) => {
        if (err) {
            console.error('Error adding recipe:', err);
            return res.status(500).json({ error: 'Error adding recipe' });
        }
        res.status(201).json({ message: 'Recipe added successfully', recipeId: result.insertId });
    });
});


// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error logging out');
        res.redirect('/');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
