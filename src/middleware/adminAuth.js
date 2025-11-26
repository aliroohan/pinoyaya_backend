const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find admin by id
        req.admin = decoded.id;
        next();
        
    } catch (error) {
        res.status(401).json({ error: 'Access denied. Invalid token.' });
    }
};
