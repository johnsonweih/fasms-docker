// routes/schemes.js
const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/schemeController');
const { authMiddleware, authorizeRole } = require('../middleware/authMiddleware');

// Middleware to ensure no request body or query parameters
const validateNoBodyOrQuery = (req, res, next) => {
    if (Object.keys(req.query).length > 0) {
        return res.status(400).json({ errors: [{ msg: 'No query parameters allowed' }] });
    }
    if (Object.keys(req.body).length > 0) {
        return res.status(400).json({ errors: [{ msg: 'No request body allowed' }] });
    }
    next();
};

// Route to get all schemes
router.get('/', authMiddleware, authorizeRole('Admin'), validateNoBodyOrQuery, schemeController.getAllSchemes);

// Route to get eligible schemes for an applicant
router.get('/eligible', authMiddleware, authorizeRole('Admin'), 
    (req, res, next) => {
        if (Object.keys(req.body).length > 0) {
            return res.status(400).json({ errors: [{ msg: 'No request body allowed' }] });
        }
        next();
    }, 
    schemeController.getEligibleSchemes
);

module.exports = router;