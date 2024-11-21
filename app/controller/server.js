const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('../model/db'); // Importing the database connection

const PORT = 5050;

// Function to serve HTML file
function serveHTML(req, res) {
    fs.readFile(path.join(__dirname, '../view/index.html'), (err, content) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server Error');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
    });
}

// Function to fetch data from MySQL database and send it as JSON
function serveUsersData(req, res) {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Database error' }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results)); // Send data as JSON
    });
}

// Function to serve static assets (CSS, JS, Images)
function serveStatic(req, res) {
    const filePath = path.join(__dirname, '../view', req.url);
    const ext = path.extname(filePath).toLowerCase();

    const mimeTypes = {
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
    };

    const mimeType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content);
        }
    });
}

// Create and start the server
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        serveHTML(req, res); // Serve the HTML page
    } else if (req.url === '/api/users') {
        serveUsersData(req, res); // Serve the users data as JSON
    } else if (req.url.startsWith('/assets/')) {
        serveStatic(req, res); // Serve static files (CSS, JS, images)
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
