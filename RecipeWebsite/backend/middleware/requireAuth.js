function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        console.log('User authenticated:', req.session.userId);
        next();
    } else {
        console.log('User not authenticated');
        res.redirect('/login.html');
    }
}


module.exports = requireAuth;
