const jwt = require('jsonwebtoken');

module.exports.adminAuth = (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find admin by id
        req.admin = decoded;
        next();
        
    } catch (error) {
        res.status(401).json({ success: false, message: 'Access denied. Invalid token.' });
    }
};

module.exports.checkRole = (role) => {
    return (req, res, next) => {
        if (!role.includes(req.admin.role)) {
            return res.status(401).json({ error: 'Access denied. Invalid role.' });
        }
        next();
    };
};

