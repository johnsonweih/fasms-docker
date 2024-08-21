const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const pool = require('../models/pool'); // Your database pool or connection module

const verifyToken = promisify(jwt.verify);

// Middleware to authenticate and authorize users
const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = await verifyToken(token, process.env.JWT_SECRET);
        req.user = decoded;
        
        // Optionally, you can load user roles here for more detailed checks
        const [rows] = await pool.query(
            'SELECT roles.name FROM user_roles JOIN roles ON user_roles.role_id = roles.id WHERE user_roles.user_id = ?',
            [req.user.id]
        );
        req.user.roles = rows.map(row => row.name);

        next();
    } catch (error) {
        res.status(403).json({ message: 'Failed to authenticate token' });
    }
};

// Middleware to check specific roles
const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        if (req.user.roles.includes(requiredRole)) {
            next();
        } else {
            res.status(403).json({ message: 'Insufficient permissions' });
        }
    };
};

module.exports = { authMiddleware, authorizeRole };
