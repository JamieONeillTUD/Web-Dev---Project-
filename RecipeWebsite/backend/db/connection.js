const mysql = require('mysql2');
require('dotenv').config(); // Load environment variables from .env file

// Create a MySQL connection pool
const connection = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',     
    user: process.env.DB_USER || 'root',         
    password: process.env.DB_PASSWORD || '',     
    database: process.env.DB_NAME || 'recipe_website', 
    waitForConnections: true,                    
    connectionLimit: 10,                         
    queueLimit: 0                                
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
