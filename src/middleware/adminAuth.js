const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const adminAuth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find admin by id
        const admin = await Admin.findById(decoded.id).select('-password');
        
        if (!admin) {
            return res.status(401).json({ error: 'Access denied. Invalid token.' });
        }

        // Add admin to request object
        req.admin = admin;
        next();
        
    } catch (error) {
        res.status(401).json({ error: 'Access denied. Invalid token.' });
    }
};

module.exports = adminAuth; 