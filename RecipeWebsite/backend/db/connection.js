const mysql = require('mysql2');
require('dotenv').config(); // Load environment variables from .env file

// Create a MySQL connection pool
const connection = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',     // Database host (default: localhost)
    user: process.env.DB_USER || 'root',         // Database user (default: root)
    password: process.env.DB_PASSWORD || '',     // Database password (default: empty)
    database: process.env.DB_NAME || 'recipe_website', // Database name
    waitForConnections: true,                    // Ensure connection pool waits for availability
    connectionLimit: 10,                         // Max number of connections in the pool
    queueLimit: 0                                // Unlimited connection queue
});

// Test the connection
connection.getConnection((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1); // Exit process with failure
    } else {
        console.log('Connected to the MySQL database.');
    }
});

module.exports = connection.promise(); // Use Promises for async/await
