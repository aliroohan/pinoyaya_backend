const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access token missing' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid access token' });
        }
        // Differentiate user type
        if (user.profession) {
            req.user = { _id: user._id, type: 'babysitter', ...user };
        } else {
            req.user = { _id: user._id, type: 'customer', ...user };
        }
        next();
    });
}; 