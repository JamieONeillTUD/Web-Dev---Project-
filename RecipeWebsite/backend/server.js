const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();
const port = 5050;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Use express-session to manage sessions
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Change secure to true if you're using https
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

const recipesRouter = require('./routes/recipes');

// Use the recipes router
app.use('/recipes', recipesRouter);

// Serve static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
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

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err.message);
            return res.status(500).send('Error hashing password');
        }

        // Insert user into the database
        const query = 'INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [first_name, last_name, username, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error registering user:', err.message); // Log detailed error
                return res.status(500).send('Error registering user');
            }

            // Redirect to login page after successful registration
            res.redirect('/login.html');
        });
    });
});

// Handle login form submission (POST)
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if email exists in the database
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error during login:', err.message);
            return res.status(500).send('Error during login');
        }

        if (results.length === 0) {
            return res.status(401).send('Invalid credentials');
        }

        const user = results[0];

        // Compare the entered password with the hashed password in the database
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err.message);
                return res.status(500).send('Error comparing passwords');
            }

            if (!isMatch) {
                return res.status(401).send('Invalid credentials');
            }

            // Store user ID in session
            req.session.userId = user.id;

            // Redirect to dashboard after successful login
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

    // Query to get user data (name, recipes, and favorites)
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err.message);
            return res.status(500).send('Error fetching user data');
        }

        const user = results[0];

        // Fetch user’s recipes
        db.query('SELECT * FROM recipes WHERE user_id = ?', [userId], (err, recipes) => {
            if (err) {
                console.error('Error fetching recipes:', err.message);
                return res.status(500).send('Error fetching recipes');
            }

            // Fetch user’s favorite recipes
            db.query('SELECT r.* FROM recipes r JOIN favorites f ON r.id = f.recipe_id WHERE f.user_id = ?', [userId], (err, favorites) => {
                if (err) {
                    console.error('Error fetching favorites:', err.message);
                    return res.status(500).send('Error fetching favorites');
                }

                // Render dashboard with user data
                res.send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Your Dashboard - Recipe Website</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
                        <style>
                            .list-group-item {
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 10px;
                                margin: 5px 0;
                                border: 1px solid #ccc;
                                border-radius: 5px;
                                background-color: #f9f9f9;
                            }
                            .btn-danger {
                                font-size: 0.8rem;
                                padding: 5px 10px;
                            }
                        </style>
                    </head>
                    <body>
                        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                            <div class="container-fluid">
                                <a class="navbar-brand" href="/">Recipe Website</a>
                                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                    <span class="navbar-toggler-icon"></span>
                                </button>
                                <div class="collapse navbar-collapse" id="navbarNav">
                                    <ul class="navbar-nav ms-auto">
                                        <li class="nav-item">
                                            <a class="nav-link" href="/user/dashboard">Dashboard</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="/logout">Logout</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                        <div class="container py-5">
                            <h1 class="display-4">Welcome, ${user.first_name}!</h1>
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
                            <ul class="list-group">
                                ${favorites.map(fav => `
                                    <li class="list-group-item" id="favorite-${fav.id}">
                                        <div>
                                            <h5>${fav.title}</h5>
                                            <p>${fav.description}</p>
                                        </div>
                                        <button class="btn btn-danger btn-sm" onclick="removeFromFavorites(${fav.id})">Remove</button>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        <footer class="bg-dark text-white text-center py-4">
                            <p>&copy; 2024 Recipe Website | All Rights Reserved</p>
                        </footer>
                        <script>
                            async function removeFromFavorites(recipeId) {
                                try {
                                    const response = await fetch(\`/recipes/\${recipeId}/favorites\`, {
                                        method: 'DELETE',
                                        headers: { 'Content-Type': 'application/json' },
                                    });

                                    if (response.ok) {
                                        alert('Recipe removed from favorites!');
                                        document.getElementById(\`favorite-\${recipeId}\`).remove();
                                    } else {
                                        alert('Failed to remove favorite. Please try again.');
                                    }
                                } catch (error) {
                                    console.error('Error removing favorite:', error);
                                    alert('Error removing favorite. Please try again.');
                                }
                            }
                        </script>
                    </body>
                    </html>
                `);
            });
        });
    });
});


// Logout route
app.get('/logout', (req, res) => {
    // Destroy the session and redirect to home page
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }

        res.redirect('/');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

