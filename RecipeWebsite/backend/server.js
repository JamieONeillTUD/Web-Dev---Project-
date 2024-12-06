const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const db = require('./db/connection'); // Import the database connection from connection.js
const app = express();
const port = 5050;



// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Middleware for JSON parsing

// Use express-session to manage sessions
app.use(session({
    secret: 'your-secret-key', // Replace with a strong secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Test the connection when the server starts
db.getConnection((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1); // Exit process with failure
    } else {
        console.log('Database connected successfully!');
    }
});

// Middleware to protect private routes
function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        next(); // User is authenticated, proceed
    } else {
        res.redirect('/login.html'); // Redirect to login if not authenticated
    }
}

// Serve static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));

// Serve public HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
});
app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'register.html'));
});
app.get('/user/dashboard', requireAuth, (req, res) => {
    console.log(req.session); // Check session to ensure user is logged in
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dashboard.html'));
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

// Fetch user details for the dashboard
app.get('/user/details', requireAuth, (req, res) => {
    const userId = req.session.userId;
    db.query('SELECT first_name, last_name, email FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user details:', err.message);
            return res.status(500).json({ error: 'Error fetching user details' });
        }
        res.json(results[0]);
    });
});

// Fetch user recipes for the dashboard
app.get('/recipes', requireAuth, (req, res) => {
    const userId = req.session.userId;
    db.query('SELECT * FROM recipes WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error fetching recipes:', err.message);
            return res.status(500).json({ error: 'Error fetching recipes' });
        }
        res.json(results);
    });
});

// Fetch user's favorite recipes
app.get('/recipes/favorites', requireAuth, (req, res) => {
    const userId = req.session.userId;
    db.query(
        `SELECT r.* 
         FROM recipes r 
         JOIN favorites f ON r.id = f.recipe_id 
         WHERE f.user_id = ?`,
        [userId],
        (err, results) => {
            if (err) {
                console.error('Error fetching favorites:', err.message);
                return res.status(500).json({ error: 'Error fetching favorites' });
            }
            res.json(results);
        }
    );
});

// Remove a recipe from favorites
app.delete('/recipes/:id/favorites', requireAuth, (req, res) => {
    const userId = req.session.userId;
    const recipeId = req.params.id;

    db.query(
        'DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?',
        [userId, recipeId],
        (err) => {
            if (err) {
                console.error('Error removing favorite:', err.message);
                return res.status(500).json({ error: 'Error removing favorite' });
            }
            res.status(200).json({ message: 'Favorite removed successfully' });
        }
    );
});

// Update user profile (POST)
app.post('/user/update-profile', requireAuth, (req, res) => {
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
