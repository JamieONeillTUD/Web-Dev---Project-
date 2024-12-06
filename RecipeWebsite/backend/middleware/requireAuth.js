function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        console.log('User authenticated:', req.session.userId); // Debugging authentication
        return next(); // User is authenticated, proceed to the next middleware or route handler
    } else {
        console.log('User not authenticated');
        return res.redirect('/login.html'); // Redirect to login if not authenticated
    }
}

module.exports = requireAuth; // Ensure this is not grayed out and is included correctly
