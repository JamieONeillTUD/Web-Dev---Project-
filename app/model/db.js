const mysql = require('mysql2');

// Database connection
const db = mysql.createConnection({
    host: 'localhost',       // Use 'localhost' for PHPMyAdmin running on localhost
    user: 'root',            // Replace with your PHPMyAdmin/MySQL username
    password: '',            // Replace with your PHPMyAdmin/MySQL password
    database: 'mydatabase'   // Replace with the name of your database
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

module.exports = db;
